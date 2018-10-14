// import * as fs from 'fs';
import * as path from 'path';
// import * as requireFromString from 'require-from-string';
import * as rimraf from 'rimraf';
import * as webpack from 'webpack';
import * as WebpackDevMiddleware from 'webpack-dev-middleware';
import * as WebpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfigs from '../config/webpack/index';

import { Express } from 'express';

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
    await this.buildTools(multiCompiler);
  }
  public buildTools = (multiCompiler: any) => {
    const webpackDevMiddlewareConfig = {
      publicPath: `/_next/static/webpack`,
      noInfo: true,
      logLevel: 'silent'
    };
    multiCompiler.
    this.webpackDevMiddleware = WebpackDevMiddleware(multiCompiler, webpackDevMiddlewareConfig);
    this.webpackHotMiddleware = WebpackHotMiddleware(multiCompiler.compilers[0], {
      log: false,
      heartbeat: 2500
    });
    this.config.app.use(this.webpackDevMiddleware);
    this.config.app.use(this.webpackHotMiddleware);
    this.config.app.render = () => {
      console.log(4214124124);
    };
  }
  public clear = async () => {
    await rm('../__server');
  }
}
