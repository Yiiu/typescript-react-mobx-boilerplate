// import * as path from 'path';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';

import * as webpackConfig from '../config/dev';
import * as serverWebpackConfig from '../config/server';

import { Express } from 'express';

// const serverReadFile = (fs: MFS, fileName: string) => {
//   return fs.readFileSync(path.join(serverWebpackConfig.output.path, fileName), 'utf-8');
// };

interface IConfig {
  app: Express;
}

type Callback<T> = (T: any) => any;

export default ({ app }: IConfig, cb: Callback<any>): Promise<{}> => {
  let renderResolve = () => {};
  let serverEntry: any;
  const promise = new Promise((resolve, reject) => renderResolve = resolve);
  const webpackCompiler = webpack(webpackConfig as any);
  const onOk = () => {
    if (serverEntry) {
      cb(serverEntry);
    }
  };
  app.use(
    webpackDevMiddleware(webpackCompiler, {
      writeToDisk: true,
      // logLevel: 'silent',
      publicPath: webpackConfig.output.publicPath
    })
  );
  // webpackCompiler.hooks.done.tapAsync('done', stats => {
  //   const info = stats.toJson();
  //   if (stats.hasWarnings()) {
  //     console.warn(info.warnings);
  //   }

  //   if (stats.hasErrors()) {
  //     console.error(info.errors);
  //     return;
  //   }
  //   onOk();
  //   renderResolve();
  // });
  const serverCompiler = webpack(serverWebpackConfig as any);
  serverCompiler.watch({}, (err, stats) => {
    const info = stats.toJson();
    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    if (stats.hasErrors()) {
      console.error(info.errors);
      return;
    }
    serverEntry = require('../build/server/entry-server');
    // console.log(serverEntry);
    onOk();
    renderResolve();
  });

  app.use(require('webpack-hot-middleware')(webpackCompiler));
  return promise;
};
