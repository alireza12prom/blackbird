import { AttachSSLDto, DettachSSLDto, ProxyOpts, RegisterDto, UnregisterDto } from './dtos';
export declare class ReversProxy {
    private proxyOpts;
    private ssl;
    private table;
    private ws_logger;
    private http_logger;
    private https_logger;
    private proxy_logger;
    private _proxyServer;
    private _httpServer;
    private _httpsServer?;
    constructor(proxyOpts: ProxyOpts);
    register({ source, target, opts }: RegisterDto): void;
    unregister({ source, target }: UnregisterDto): void;
    attachSSL({ hostname, key, cert, ca }: AttachSSLDto): void;
    dettachSSL({ hostname }: DettachSSLDto): void;
    start(): void;
    startCluster(n: number): void;
    stop(): void;
    private __setupProxyServer;
    private __setupHttpServer;
    private __setupHttpsServer;
    private __httpHandler;
    private __httpsHandler;
    private createSecureContext;
    private searchTarget;
    private searchSsl;
}
