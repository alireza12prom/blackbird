import { ReversProxy } from './proxy';

const myProxy = new ReversProxy({
  http: {
    port: 9000,
  },
  https: {
    port: 4040,
    key: __dirname + '\\..\\express\\cert\\3\\key.pem',
    cert: __dirname + '\\..\\express\\cert\\3\\cert.pem',
  },
  logging: true,
});

myProxy.start();

myProxy.register({
  source: '',
  target: '',
  opts: {
    redirect: true,
    ws: true,
  },
});
