import * as express from 'express';

import * as path from 'path';

import * as appConfig from '../config';
import serverRender from './serverRender';

const app = express();
let render;
if (process.env.NODE_ENV !== 'production') {
  render = serverRender({app});
}

// app.use(favicon(path.join(__dirname, "public/favicon.ico")));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public/static')));

app.get('*', async (req, res) => {
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
    app.listen(appConfig.port as any, appConfig.host, (err: any) => {
      if (err) {
        console.error(err);
      } else {
        console.info(`\n\n 💂  Listening at http://${appConfig.host}:${appConfig.port}\n`);
      }
    });
  });
}
