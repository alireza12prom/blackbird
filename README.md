# Blackbird
Blackbird is a reverse proxy, with built-in node cluster and load balancing.

## Installation

To install `Blackbird` you can easily run below command:

```
npm i @namatery/blackbird
```

## How to use Blackbird?

First of all, create a proxy server like below:

```
const proxy = new ReversProxy({
  http: {
    port: 3000,
  },
});
```


> NOTE: `http.port` is required.


## Registering

To register a domain, do like this:

```
proxy.register({
  source: 'http://localhost:3000/',
  target: 'http://test.com/',
  opts: {
    redirect: false,
    ws: false,
  },
});
```

### Options
- `source` [required]: The url that client make a request to it. 
- `target` [required]: The url that if client makes a reqeust to `source`, Blackbird redirects the request to it.
- `redirect` [optional]: If set `true`, Blackbird automatically redirects to HTTPS.
- `ws` [optional]: If set `true`, Blackbird allows clients to make socket connection.

### Notice
- You can set several `target` for a single `source`.
- Before set `redirect` as `true`, make sure you have configured proxy for HTTPS requests.
- For load balancing, Blackbird uses [round-robin] algorithm.


## Enable HTTPS

To enable HTTPS, you can pass creditions like below:

```
const proxy = new ReversProxy({
  http: {
    port: 3000,
  },
  https: {
    port: 9000,
    cert: 'path/to/cert.pem',
    key: 'path/to/key.pem',
    ca: 'path/to/ca.pem',
  },
});
```

> NOTE 1: `port` is required.

> NOTE 2: `cert`, `key` and `ca` can be buffers. (`ca` is optional)

In the above example, the creditoins that we set wil use for all registerd domain, but you can also attach the creditions for a specifyed domain.

```
proxy.attachSSL({
  hostname: 'localhost:3000',
  cert: 'path/to/cert.pem',
  key: 'path/to/key.pem',
  ca: 'path/to/ca.pem',
});
```

> NOTE 1: `hostname` is the hostname that we registerd as `source` above as you saw.

> NOTE 2: You can't attach several creditions for a single `hostname`.


## How to run Redbird?

To start proxy, you have two options. You can either run it in the normal way like below:

```
proxy.start();
```

Or run it in the cluster mode like below:

```
proxy.startCluster(3);
```

In this case Blackbird will run three instances of our proxy. To learn more about `cluster` in nodejs go to [node-cluster].


[round-robin]: https://en.wikipedia.org/wiki/Round-robin_scheduling
[node-cluster]: https://nodejs.org/api/cluster.html#:~:text=Clusters%20of%20Node.js%20processes,a%20single%20Node.js%20instance.
