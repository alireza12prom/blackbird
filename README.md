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


[round-robin]: https://en.wikipedia.org/wiki/Round-robin_scheduling
