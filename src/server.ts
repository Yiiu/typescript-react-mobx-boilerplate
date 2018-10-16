import * as express from 'express';
import * as Loadable from 'react-loadable';
import * as favicon from 'serve-favicon';

import * as path from 'path';

let serverRender = require('./serverRender').default;

import config from '../config/index';

const app = express();

if ((module as any).hot) {
  (module as any).hot.accept(() => {
    console.log('🔁  HMR Reloading...');
  });
  (module as any).hot.accept('./serverRender', () => {
    console.log('🔁  HMR Reloading `./serverRender`...');
    try {
      serverRender = require('./serverRender').default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

Loadable.preloadAll().then(() => {
  app.listen(config.port as any, config.host, (err: any) => {
    if (err) {
      console.error(err);
    } else {
      console.info(`\n\n 💂  Listening at http://${config.host}:${config.port}\n`);
    }
  });
});

app.use(favicon(path.join(__dirname, '../../', 'public/favicon.ico')));
app.use('/public', express.static(path.join(__dirname, '../')));
app.get('*', async (req, res) => {
  res.send(await serverRender(req));
});

// (async () => {
//   const serverRender = new ServerRender({
//     isServer: true,
//     app
//   });
//   try {
//     await serverRender.run();
//   } catch (err) {
//     console.error(err);
//   }

// })();
