import * as express from 'express';
import * as Loadable from 'react-loadable';
import * as favicon from 'serve-favicon';

import * as path from 'path';

import ServerRender from './serverRender';

import config from '../config/index';

const app = express();

Loadable.preloadAll()
.then(e => {
  app.listen(config.port as any, config.host, (err: any) => {
    if (err) {
      console.error(err);
    } else {
      console.info(`\n\n 💂  Listening at http://${config.host}:${config.port}\n`);
    }
  });
});
(async () => {
  const serverRender = new ServerRender({
    isServer: true,
    app
  });
  try {
    await serverRender.run();
  } catch (err) {
    console.error(err);
  }
  app.use(favicon(path.join(__dirname, '../', 'public/favicon.ico')));
  app.use('/public', express.static(path.join(__dirname, '../', config.build)));
  app.get('*', (req, res) => {
    const html = serverRender.render(req);
    res.send(html);
  });

})();
