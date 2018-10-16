
import * as express from 'express';
import * as fs from 'fs';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import * as webpack from 'webpack';
import * as WebpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfigs, { IAppConfig } from '../config/webpack/index';
const clearConsole = require('react-dev-utils/clearConsole');

import paths from '../config/paths';

const app = express();
const main = async () => {
  let config: IAppConfig = {};
  if (await fs.existsSync(paths.appConfig)) {
    try {
      config = require(paths.appConfig);
    } catch (e) {
      clearConsole();
      console.error('Invalid razzle.config.js file.', e);
      process.exit(1);
    }
  }
  const clientConfig = webpackConfigs({
      dev: true,
      isServer: false
    }, config) as any;
  const serverConfig = webpackConfigs({
      dev: true,
      isServer: true
    }, config) as any;
  const webpackConfig = [
    serverConfig,
    clientConfig
  ];
  const multiCompiler = webpack(webpackConfig as any) as any;

  multiCompiler.hooks.done.tap('done', (stats) => {
    const rawMessages = stats.toJson({}, true);
    const messages = formatWebpackMessages(rawMessages);
    if (!messages.errors.length && !messages.warnings.length) {
      console.log('Compiled successfully!');
    }
    if (messages.errors.length) {
      console.log('Failed to compile.');
      messages.errors.forEach(e => console.log(e));
      return;
    }
    if (messages.warnings.length) {
      console.log('Compiled with warnings.');
      messages.warnings.forEach(w => console.log(w));
    }
  });
  const webpackDevMiddlewareConfig = {
    publicPath: `/__server/static/webpack`,
    noInfo: true,
    logLevel: 'silent'
  };
  app.use(WebpackDevMiddleware(multiCompiler, webpackDevMiddlewareConfig));

  app.use(require('webpack-hot-middleware')(multiCompiler.compilers[1], clientConfig.devServer));
  const port = (
    process.env.PORT ?
    (parseInt(process.env.PORT, 10) + 1) : (config.port || 3001)
  );
  const host = process.env.HOST ? process.env.HOST : (config.host || 3001);
  app.listen(port, () => {
    // if (openBrowser('http://localhost:3000')) {
    //   console.log('The browser tab has been opened!');
    // }
    console.log(`hot server ${host} at ${port}`);
  });
};

main();
