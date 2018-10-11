import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';

import * as webpackConfig from '../config/dev';

import { Express } from 'express';

// const MemoryFileSystem = require('memory-fs');
// const mfs = new MemoryFileSystem();

interface IConfig {
  app: Express;
}

export default ({ app }: IConfig): Promise<{}> => {
  let renderResolve = () => {};
  const promise = new Promise((resolve, reject) => renderResolve = resolve);
  const webpackCompiler = webpack(webpackConfig as any);
  webpackCompiler.hooks.done.tapAsync('done', stats => {
    const info = stats.toJson();
    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    if (stats.hasErrors()) {
      console.error(info.errors);
      return;
    }
    renderResolve();
  });
  app.use(
    webpackDevMiddleware(webpackCompiler, {
      writeToDisk: true,
      logLevel: 'silent',
      publicPath: webpackConfig.output.publicPath
    })
  );

  app.use(require('webpack-hot-middleware')(webpackCompiler));
  return promise;
};
