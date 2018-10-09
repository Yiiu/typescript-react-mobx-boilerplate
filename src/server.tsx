import * as express from 'express';
import * as React from 'react';

import { Provider } from 'mobx-react';
import { StaticRouter } from 'react-router';

import * as path from 'path';
// import { Provider } from 'mobx-react';

import { renderToString } from 'react-dom/server';

import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackConfig from '../config/dev';

// import axios from 'axios';

import App from '@containers';

import { createStore } from '@stores';

import Html from '@containers/Html';

import * as appConfig from '../config';

const app = express();
if (process.env.NODE_ENV !== 'production') {
  const webpackCompiler = webpack(webpackConfig as any);
  // webpackCompiler.run(() => {});
  app.use(
    webpackDevMiddleware(webpackCompiler, {
      lazy: false,
      logLevel: 'info',
      stats: {colors: true},
      // writeToDisk: true,
      publicPath: webpackConfig.output.publicPath,
      noInfo: true
    } as any)
  );

  app.use(require('webpack-hot-middleware')(webpackCompiler));
}

// app.use(favicon(path.join(__dirname, "public/favicon.ico")));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public/static')));

app.get('*', async (req, res) => {
  const newStores = createStore();
  const Router = StaticRouter as any;
  const markup = renderToString(
    <Router location={req.url} content={{}}>
      <Provider { ...newStores }>
        <App/>
      </Provider>
    </Router>
  );
  res.status(200).send(
    renderToString(
      <Html markup={markup} />
    )
  );
});

app.listen(appConfig.port as any, appConfig.host, (err: any) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`\n\n 💂  Listening at http://${appConfig.host}:${appConfig.port}\n`);
  }
});
