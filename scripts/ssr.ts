
import * as express from 'express';
import * as webpack from 'webpack';
import * as WebpackDevMiddleware from 'webpack-dev-middleware';
import * as WebpackDevServer from 'webpack-dev-server';
import webpackConfigs from '../config/webpack/index';

const app = express();

const webpackConfig = [
  webpackConfigs({dev: true, isServer: true}) as any,
  webpackConfigs({dev: true, isServer: false}) as any
];

const multiCompiler = webpack(webpackConfig as any) as any;

multiCompiler.compilers[0].watch(
  {
    quiet: true,
    stats: 'none',
  },
  /* eslint-disable no-unused-vars */
  stats => {}
);

const webpackDevMiddlewareConfig = {
  publicPath: `/__server/static/webpack`,
  noInfo: true,
  logLevel: 'silent'
};

app.use(WebpackDevMiddleware(multiCompiler, webpackDevMiddlewareConfig));

app.use(require('webpack-hot-middleware')(multiCompiler.compilers[1], {}));

app.listen(3000, () => {
  console.log('hot server listening at :3000');
});
