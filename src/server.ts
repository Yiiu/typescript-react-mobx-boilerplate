import * as express from 'express';
import * as Loadable from 'react-loadable';

import * as path from 'path';

import ServerRender from './serverRender';

import config from '../config/index';

const app = express();

const serverRender = new ServerRender({
  isServer: true,
  app
});

// app.use(favicon(path.join(__dirname, "public/favicon.ico")));

app.use('/public', express.static(path.join(__dirname, '../', config.clientBuild)));

app.get('*', (req, res) => {
  // const stats = require('../__server/react-loadable.json');
  // res.send(serverApp.default(req, stats));
});

serverRender.run().then(() => {
  Loadable.preloadAll().then(() => {
    app.listen(config.port as any, config.host, (err: any) => {
      if (err) {
        console.error(err);
      } else {
        console.info(`\n\n 💂  Listening at http://${config.host}:${config.port}\n`);
      }
    });
  });
});
