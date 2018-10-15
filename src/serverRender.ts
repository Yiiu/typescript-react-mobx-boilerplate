// import * as fs from 'fs';
import * as path from 'path';
// import * as requireFromString from 'require-from-string';
import * as rimraf from 'rimraf';
import * as webpack from 'webpack';
import * as WebpackDevMiddleware from 'webpack-dev-middleware';
// import * as WebpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfigs from '../config/webpack/index';

import { Express, Request } from 'express';

const rm = async (url: string) => {
  return new Promise((resolve) => {
    rimraf(path.join(__dirname, url), () => {
      resolve();
    });
  });
};

interface IConfig {
  app: Express;
  isServer: boolean;
}

// type Callback<T> = (T: any) => any;

export default class ServerRender {
  public webpackDevMiddleware?: any;
  public webpackHotMiddleware?: any;
  public clientConfig = webpackConfigs({dev: true, isServer: false}) as any;
  public serverConfig = webpackConfigs({dev: true, isServer: true}) as any;
  public config: IConfig;

  constructor(options: IConfig) {
    this.config = options;
  }
  public run = async () => {
    const configs = [
      this.clientConfig,
      this.serverConfig
    ];
    await this.clear();
    console.info('clean done!');
    const multiCompiler = webpack(configs as any) as any;
    return await this.buildTools(multiCompiler);
  }
  public buildTools = async (multiCompiler: any) => {
    const webpackDevMiddlewareConfig = {
      publicPath: `/_next/static/webpack`,
      noInfo: true,
      logLevel: 'silent'
    };
    let resolve!: () => any;
    const promises = new Promise((res) => resolve = res);
    let isOk = -1;
    multiCompiler.compilers[0].hooks.done.tap('client', () => {
      if (isOk === 0) {
        resolve();
      } else {
        isOk++;
      }
    });
    multiCompiler.compilers[1].hooks.done.tap('server', () => {
      if (isOk === 0) {
        resolve();
      } else {
        isOk++;
      }
    });
    // multiCompiler.
    this.webpackDevMiddleware = WebpackDevMiddleware(multiCompiler, webpackDevMiddlewareConfig);
    this.config.app.use(require('webpack-hot-middleware')(multiCompiler.compilers[0], {
    }));
    // this.config.app.use(this.webpackDevMiddleware);
    // this.config.app.use(this.webpackHotMiddleware);
    return promises;
  }
  public render = (req: Request) => {
    const appRender = require('../__server/server/app').default;
    const stats = require('../__server/react-loadable.json');
    return appRender(req, stats);
  }
  public clear = async () => {
    await rm('../__server');
  }
}
