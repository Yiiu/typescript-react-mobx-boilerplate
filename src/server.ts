import * as express from 'express';
import * as Loadable from 'react-loadable';

import * as path from 'path';

import * as appConfig from '../config';
import serverRender from './serverRender';

import * as config from '../config/index';

interface IServerApp {
  default: (req: express.Request, stats: any) => any;
}

const app = express();
let render;
let serverApp: IServerApp;
if (process.env.NODE_ENV !== 'production') {
  render = serverRender({app}, (server) => {
    serverApp = server;
  });
}
// app.use(favicon(path.join(__dirname, "public/favicon.ico")));

app.use('/public', express.static(path.join(__dirname, '../', config.clientBuild)));

app.get('*', (req, res) => {
  const stats = require('../__server/react-loadable.json');
  res.send(serverApp.default(req, stats));
  // const newStores = createStore();
  // const Router = StaticRouter as any;
  // const markup = renderToString(
  //   <Router location={req.url} content={{}}>
  //     <Provider { ...newStores }>
  //       <App/>
  //     </Provider>
  //   </Router>
  // );
  // res.status(200).send(
  //   renderToString(
  //     <Html markup={markup} />
  //   )
  // );
});

if (render) {
  render.then(() => {
    Loadable.preloadAll().then(() => {
      app.listen(appConfig.port as any, appConfig.host, (err: any) => {
        if (err) {
          console.error(err);
        } else {
          console.info(`\n\n 💂  Listening at http://${appConfig.host}:${appConfig.port}\n`);
        }
      });
    });
  });
}
