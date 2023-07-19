import os from 'os';
import tls from 'tls';
import http from 'http';
import cors from 'cors';
import https from 'https';
import cluster from 'cluster';
import httpProxy from 'http-proxy';
import { Logger } from './libs/logger';
import * as urlJoin from 'url-join-ts';
import { ProxyConstants } from './constants';
import { URL, file, TableRepository, SslRepository } from './libs';

import {
  AttachSSLDto,
  DettachSSLDto,
  ProxyOpts,
  RegisterDto,
  SearchTargetReturnType,
  UnregisterDto,
} from './dtos';

import {
  AttachSSLFailedException,
  CreateSecureContextException,
  HttpServerException,
  HttpsServerException,
  RegisterFailedException,
} from './errors';

export class ReversProxy {
  private ssl = new SslRepository();
  private table = new TableRepository();
  private ws_logger!: Logger;
  private http_logger!: Logger;
  private https_logger!: Logger;
  private proxy_logger!: Logger;
  private _proxyServer!: httpProxy;
  private _httpServer!: http.Server;
  private _httpsServer?: https.Server;
  constructor(private proxyOpts: ProxyOpts) {}

  register({ source, target, opts }: RegisterDto) {
    // --- check source and target are valid
    const digestedSource = URL.digest({ url: source });
    if (!digestedSource.isValid) {
      throw new RegisterFailedException(`⚠ <source> is not valid: ${source}`);
    }

    const digestedTarget = URL.digest({ url: target });
    if (!digestedTarget.isValid) {
      throw new RegisterFailedException(`⚠ <target> is not valid: ${target}`);
    }

    opts = opts || { redirect: false, ws: false };

    // --- chekc source is uniqe
    if (
      !this.table.isUnique({
        source: {
          hostname: digestedSource.hostname,
          path: digestedSource.path,
        },
        target: {
          hostname: digestedTarget.hostname,
          path: digestedTarget.path,
        },
      })
    ) {
      throw new RegisterFailedException(`⚠ <source> must be uniqe`);
    }

    if (opts.redirect && !this.ssl.exists({ hostname: digestedSource.host })) {
      this.proxy_logger.info(
        `Because you didn\'t attach any ssl the default will be used for [${digestedSource.host}]`
      );
    }

    // --- register
    this.table.add({
      source: {
        hostname: digestedSource.host,
        path: digestedSource.path,
      },
      target: {
        hostname: digestedTarget.hostname,
        path: digestedTarget.path,
        ws: typeof opts.ws == 'boolean' ? opts.ws : false,
        redirect: typeof opts.redirect == 'boolean' ? opts.redirect : false,
      },
    });

    this.proxy_logger.message(
      `[${digestedSource.url}] refers to [${digestedTarget.url}]`
    );
  }

  unregister({ source, target }: UnregisterDto) {
    // --- check source and target are valid
    const digestedSource = URL.digest({ url: source });
    if (!digestedSource.isValid) {
      throw new RegisterFailedException(`⚠ <source> is not valid: ${source}`);
    }

    const digestedTarget = URL.digest({ url: target });
    if (!digestedTarget.isValid) {
      throw new RegisterFailedException(`⚠ <target> is not valid: ${target}`);
    }

    // --- try to remove target
    const result = this.table.remove({
      target: { hostname: digestedTarget.hostname, path: digestedTarget.path },
      source: { hostname: digestedSource.host, path: digestedSource.path },
    });

    if (result) {
      this.proxy_logger.message(`[${digestedTarget.url}] is unregistered.`);
    } else {
      this.proxy_logger.warning(`[${digestedTarget.url}] didn't found!`);
    }
  }

  attachSSL({ hostname, key, cert, ca }: AttachSSLDto) {
    // return a warring if https is not running
    if (!this._httpsServer) {
      this.proxy_logger.warning(
        'https server is not running. attaching ssl context is not usefull!'
      );
    }

    const { host } = URL.detachHostFromPort(hostname);

    // check host name registered`
    if (!this.table.exists({ hostname: host })) {
      throw new AttachSSLFailedException(`[${host}] didn't register.`);
    }

    // check any ssl context attached to the `hostname`
    if (this.ssl.exists({ hostname: host })) {
      throw new AttachSSLFailedException(
        `You have already attached ssl context to [${host}]`
      );
    }

    // attach ssl context
    this.ssl.add({
      hostname: host,
      secureContext: this.createSecureContext(key, cert, ca),
    });
    this.proxy_logger.message(`The ssl context attached to [${host}] successfully!`);
  }

  dettachSSL({ hostname }: DettachSSLDto) {
    const { host } = URL.detachHostFromPort(hostname);
    if (!this.ssl.remove({ hostname: host })) {
      this.proxy_logger.warning(`no ssl context is attached to [${host}].`);
    } else {
      this.proxy_logger.message(`ssl context is dettached from [${host}].`);
    }
  }

  start() {
    this.__setupProxyServer();
    this.__setupHttpServer();

    /**
     * setup logger
     */

    let { logging } = this.proxyOpts;
    this.ws_logger = new Logger('WS', logging === true);
    this.http_logger = new Logger('HTTP', logging === true);
    this.https_logger = new Logger('HTTPS', logging === true);
    this.proxy_logger = new Logger('PROXY', logging === true);

    /**
     * setup https
     */
    if (this.proxyOpts.https) {
      // generate default secure context
      const { cert, key, ca } = this.proxyOpts.https;
      const defaultContext = this.createSecureContext(key, cert, ca);

      // attach the default ssl
      this.ssl.add({
        hostname: ProxyConstants.DEFAULT_SSL_KEY,
        secureContext: defaultContext,
      });

      this.__setupHttpsServer();
    }
  }

  startCluster(n: number) {
    /**
     * number of clusters must be match with number of cpus
     */
    const cpus = os.cpus().length;
    if (n > cpus) {
      this.proxy_logger.error(`The mex clusters that can be used is ${cpus}.`);
      return;
    }

    if (cluster.isPrimary) {
      /**
       * start forking
       */
      for (let i = 0; i < n; i++) {
        cluster.fork();
      }

      /**
       * create new fork if one of the worker crashed
       */
      cluster.on('exit', (worker, code, signal) => {
        this.proxy_logger.log(`worker ${worker.process.pid} died. forking new one...`);
        cluster.fork();
      });
    } else {
      this.start();
    }
  }

  stop() {
    this._httpServer.close((error) => {
      if (error) {
        throw new HttpServerException(error.message);
      }
      if (this._httpsServer) {
        this._httpsServer.close((error) => {
          if (error) {
            throw new HttpsServerException(error.message);
          }
        });
      }
    });
  }

  private __setupProxyServer() {
    this._proxyServer = httpProxy.createProxyServer({
      prependPath: false,
      xfwd: false,
      secure: false,
    });

    this._proxyServer.on('error', (err, req, res, target) => {
      const hostname = target ? (target as any)['host'] : 'unknown';

      if (err && (err as any)['code'] == 'ECONNREFUSED') {
        this.proxy_logger.error(
          `proxing to [${hostname}] faild! [maybe the target does not exist]`
        );
        return;
      }

      if (err && (err as any)['code'] == 'EPROTO') {
        this.proxy_logger.error(
          `proxing to [${hostname}] faild! [maybe the target doesn't support https]`
        );
        return;
      }

      if (err && (err as any)['code'] == 'DEPTH_ZERO_SELF_SIGNED_CERT') {
        this.proxy_logger.error(
          `proxing to [${hostname}] faild! [set <secure:false> if your ssl contexts are self-signed]`
        );
        return;
      }

      if (err && (err as any)['code'] == 'ECONNRESET') {
        this.proxy_logger.error(
          `proxing to [${hostname}] faild! [maybe target can't support socket]`
        );
        return;
      }

      console.log(err);
      this.proxy_logger.error('unknown error!');
    });
  }

  private __setupHttpServer() {
    this._httpServer = http.createServer();
    const { port } = this.proxyOpts.http;

    this._httpServer.on('error', (error) => {
      throw new HttpServerException(error.message);
    });

    this._httpServer.on('close', () => {
      this.http_logger.info('server is closed.');
    });

    this._httpServer.on('listening', () => {
      this.http_logger.info(`server is listening [${port}]`);
    });

    this._httpServer.on('request', (req, res) => {
      if (this.proxyOpts.cors) {
        cors(this.proxyOpts.cors)(req, res, (err) => {
          if (err) {
            this.http_logger.error(`Error on handling cors!`);
            res.end();
          } else {
            this.__httpHandler(req, res);
          }
        });
      } else {
        this.__httpHandler(req, res);
      }
    });

    this._httpServer.on('upgrade', (req, socket, head) => {
      const result = this.searchTarget(req, 'http_ws');

      if (result.target) {
        this._proxyServer.ws(req, socket, head, { target: result.target });
        this.ws_logger.message(`proxing [${result.source} -> ${result.target}]`);
      } else {
        socket.destroy();
        this.ws_logger.error(`proxing [${result.source} -> ?]`);
      }
    });

    this._httpServer.listen(port, '0.0.0.0');
  }

  private __setupHttpsServer() {
    this._httpsServer = https.createServer({
      SNICallback: (servername, cb) => {
        const result = this.searchSsl(servername);
        if (result.hostname == ProxyConstants.DEFAULT_SSL_KEY) {
          this.https_logger.log('Using default ssl context.');
        }
        cb(null, result.secureContext);
      },
    });
    const { port } = this.proxyOpts.https!;

    this._httpsServer.on('error', (error) => {
      throw new HttpsServerException(error.message);
    });

    this._httpsServer.on('close', () => {
      this.https_logger.info('server is closed.');
    });

    this._httpsServer.on('listening', () => {
      this.https_logger.info(`server is listening [${port}]`);
    });

    this._httpsServer.on('request', (req, res) => {
      if (this.proxyOpts.cors) {
        cors(this.proxyOpts.cors)(req, res, (err) => {
          if (err) {
            this.https_logger.error(`Error on handling cors!`);
            res.end();
          } else {
            this.__httpsHandler(req, res);
          }
        });
      } else {
        this.__httpsHandler(req, res);
      }
    });

    this._httpsServer.on('upgrade', (req, socket, head) => {
      const result = this.searchTarget(req, 'https_ws');

      if (result.target) {
        this._proxyServer.ws(req, socket, head, { target: result.target });
        this.ws_logger.message(`proxing [${result.source} -> ${result.target}]`);
      } else {
        socket.destroy();
        this.ws_logger.error(`proxing [${result.source} -> ?]`);
      }
    });

    this._httpsServer.listen(port, '0.0.0.0');
  }

  private __httpHandler(req: http.IncomingMessage, res: http.ServerResponse) {
    const result = this.searchTarget(req, 'http');

    if (result.target) {
      if (result.redirect) {
        res.writeHead(302, { Location: result.target }).end();
        this.http_logger.info(`redirecting [${result.source} -> ${result.target}]`);
      } else {
        this._proxyServer.web(req, res, { target: result.target });
        this.http_logger.message(`proxing [${result.source} -> ${result.target}]`);
      }
    } else {
      res.destroy();
      this.http_logger.error(`proxing [${result.source} -> ?]`);
    }
  }

  private __httpsHandler(req: http.IncomingMessage, res: http.ServerResponse) {
    const result = this.searchTarget(req, 'https');

    if (result.target) {
      this._proxyServer.web(req, res, { target: result.target });
      this.https_logger.message(`proxing [${result.source} -> ${result.target}]`);
    } else {
      res.destroy();
      this.https_logger.error(`proxing [${result.source} -> ?]`);
    }
  }

  private createSecureContext(
    key: string | Buffer,
    cert: string | Buffer,
    ca?: string | Buffer
  ) {
    const context: Record<string, Buffer> = {};

    // --- if context type was string, shoud read from text
    if (typeof key == 'string') {
      const _key = file.openIfExists(key);
      if (!_key) {
        throw new CreateSecureContextException(`<key> does not exists in path ${key}.`);
      }
      context.key = _key;
    } else context.key = key;

    if (typeof cert == 'string') {
      const _cert = file.openIfExists(cert);
      if (!_cert) {
        throw new CreateSecureContextException(`<cert> does not exists in path ${cert}.`);
      }
      context.cert = _cert;
    } else context.cert = cert;

    if (typeof ca == 'string') {
      const _ca = file.openIfExists(ca);
      if (!_ca) {
        throw new CreateSecureContextException(`<ca> does not exists in path ${ca}.`);
      }
      context.ca = _ca;
    } else if (ca instanceof Buffer) context.ca = ca;

    // --- ssl register
    return tls.createSecureContext(context);
  }

  private searchTarget(
    req: http.IncomingMessage,
    type: 'http' | 'https' | 'http_ws' | 'https_ws'
  ) {
    if (!req.headers['host']) return { source: 'unknown', target: null };

    const incomePath = req.url || '/';
    const hostname = req.headers['host'];
    const { host: incomeHost } = URL.detachHostFromPort(hostname);

    let response: SearchTargetReturnType = {
      source: '',
      target: null,
      redirect: false,
    };

    if (type == 'http_ws' || type == 'https_ws') {
      const protocol = type == 'http_ws' ? 'http' : 'https';
      response.source = `${protocol}://${hostname}`;

      // try to find target
      const host = this.table.find({ hostname: incomeHost });
      if (!host) return response;

      // Filter those subscribers who have permission to establishing socket connection
      const subs = host.subscriber.filter((s) => s.ws);
      if (!subs.length) return response;

      if (host.rr.ws >= subs.length) {
        host.rr.ws = 0;
      }

      /**
       * perform Round Robin
       */
      const target = subs[host.rr.ws];
      host.rr.ws = (host.rr.ws + 1) % subs.length;

      /**
       * generate target url
       */
      response.target = urlJoin.urlJoin(`${protocol}://${target.hostname}`, incomePath);
    } else {
      response.source = `${type}://${hostname}${incomePath}`;

      // try to find target
      const host = this.table.find({ hostname: incomeHost, path: incomePath });
      if (!host) return response;

      if (host.rr.http >= host.subscriber.length) {
        host.rr.http = 0;
      }

      /**
       * perform Round Robin
       */
      const target = host.subscriber[host.rr.http];
      host.rr.http = (host.rr.http + 1) % host.subscriber.length;

      /**
       * NOTE: in this case target is the https version of the income url
       */
      if (type == 'http' && target.redirect) {
        /**
         * if <https> is not listening, redirecting is not possible
         */
        if (!this._httpsServer) {
          return response;
        }

        const sourceHost = hostname.split(':')[0];
        const sourcePort = this.proxyOpts.https!.port;
        response.target = urlJoin.urlJoin(
          `https://${sourceHost}:${sourcePort}`,
          incomePath
        );
      } else {
        /**
         * NOTE: the client must set <redirect:true> even
         *  if passed ssl contexts
         */
        if (type == 'https' && !target.redirect) return response;

        /**
         * merge `incomePath` and `hostPath` then add it to the end of `targetPath`
         */
        const path = URL.merge({
          incomePath: incomePath,
          sourcePath: host.path,
          targetPath: target.path,
        });

        response.target = urlJoin.urlJoin(`${type}://${target.hostname}`, path);
      }

      response.redirect = target.redirect;
    }
    return response;
  }

  private searchSsl(hostname: string) {
    // try to find the ssl that is attached to `hostname`
    const { host } = URL.detachHostFromPort(hostname);
    const ssl = this.ssl.find({ hostname: host });
    if (ssl) return ssl;

    // return default if source is not attached to any ssl
    return this.ssl.find({ hostname: ProxyConstants.DEFAULT_SSL_KEY })!;
  }
}
