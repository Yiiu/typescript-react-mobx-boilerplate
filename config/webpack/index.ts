import * as path from 'path';

// import * as AutoDllPlugin from 'autodll-webpack-plugin';
import * as webpack from 'webpack';

import * as CaseSensitivePathPlugin from 'case-sensitive-paths-webpack-plugin';
import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ReactLoadablePlugin } from 'react-loadable/webpack';
import * as StartServerPlugin from 'start-server-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import * as merge from 'webpack-merge';
import * as WebpackBar from 'webpackbar';
import * as WriteFilePlugin from 'write-file-webpack-plugin';

const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');

import { getEnv } from '../env';

import paths from '../paths';

import scriptLoader from './loader/script';
import styleLoader from './loader/style';

export interface IAppConfig {
  configureWebpack?: any;
  plugins?: any[];
  hotPort?: string;
  hotHost?: string;
  port?: string;
  host?: string;
  modify?: <T>(webpackConfig: T, config: IConfig) => any;
}

export interface IConfig {
  dev: boolean;
  isServer: boolean;
}

export default (
  {
    dev = false,
    isServer = false
  }: IConfig,
  {
    plugins = [],
    configureWebpack,
    modify,
  }: IAppConfig
) => {
  const webpackMode = dev ? 'development' : 'production';
  const dotenv = getEnv(isServer, {
    plugins,
    configureWebpack,
    modify,
  });
  const hostPort = parseInt(dotenv.PORT, 10) + 1;
  const publicPath = !process.env.SSR ? '/public/' : '/public/';
  const entry = isServer ?
    ['./src/server.ts'] :
    [
      `webpack-hot-middleware/client?reload=true&path=http://${dotenv.HOST}:${hostPort}/__webpack_hmr`,
      paths.appClientIndexJs
    ];
  let webpackConfig = {
    mode: webpackMode,
    devtool: 'source-map',
    name: isServer ? 'server' : 'client',
    target: isServer ? 'node' : 'web',
    cache: true,
    entry,
    output: {
      path: path.join(paths.appBuildSrc, isServer ? 'server' : ''),
      filename: isServer ? 'server.js' : 'static/chunks/app.js',
      publicPath,
      libraryTarget: isServer ? 'commonjs2' : 'jsonp',
      hotUpdateChunkFilename: 'static/webpack/[id].[hash].hot-update.js',
      hotUpdateMainFilename: 'static/webpack/[hash].hot-update.json',
      chunkFilename: isServer ? '[name].[contenthash].js' : 'static/chunks/[name].[contenthash].js',
    },
    // performance: {
    //   hints: false
    // },
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'styles': paths.appStyles
      },
      plugins: [
        new TsconfigPathsPlugin({
          // configFile: paths.appTsconfig
        }),
      ]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'tslint-loader',
          enforce: 'pre'
        },
        styleLoader({isServer}),
        scriptLoader({isServer}),
        {
          exclude: [/\.(js|jsx|mjs|tsx?)$/, /\.html$/, /\.json$/, /\.css|less$/],
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ]
    },
    plugins: [
      // new AutoDllPlugin(),
      new webpack.DefinePlugin(dotenv),
      isServer && new StartServerPlugin({
        name: 'server.js',
        nodeArgs: ['-r', 'source-map-support/register'],
      }),
      new webpack.NamedModulesPlugin(),
      !isServer && new ReactLoadablePlugin({
        filename: path.join(__dirname, '..', '..', paths.appBuild, 'react-loadable.json'),
      }),
      new WebpackBar({
        name: isServer ? 'server' : 'client'
      }),
      dev && new FriendlyErrorsWebpackPlugin(),
      dev && new webpack.HotModuleReplacementPlugin(),
      dev && new CaseSensitivePathPlugin(),
      dev && new WriteFilePlugin({
        exitOnErrors: false,
        log: false,
        // required not to cache removed files
        useHashIndex: false
      }),
      new MiniCssExtractPlugin({
        filename: 'static/style/[name].css',
        chunkFilename: 'static/style/[id].css'
      }),
    ].filter(Boolean)
  };
  if (dev) {
    (webpack as any).devServer = {
      compress: true,
      host: dotenv.HOST,
      port: hostPort,
      watchOptions: {
        ignored: /node_modules/,
      },
      contentBase: paths.appBuildSrc,
      publicPath: '/__server',
      before(app: any) {
        app.use(errorOverlayMiddleware());
      },
    };
  }
  if (isServer) {
    if (dev) {
      webpackConfig.entry.unshift('webpack/hot/poll?1000');
      // webpackConfig.entry.unshift('react-hot-loader/patch');
    }
    (webpackConfig as any).node = {
      __console: false,
      __dirname: false,
      __filename: false,
    };
  }
  if (process.env.SSR) {
    webpackConfig.plugins.unshift(
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
      }),
    );
    webpackConfig.plugins.unshift(
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, dotenv),
    );
  }
  merge(configureWebpack, (webpackConfig as any));
  if (modify) {
    webpackConfig = modify<typeof webpackConfig>(webpackConfig, { isServer, dev });
  }
  return webpackConfig;
};
