import * as path from 'path';

// import * as AutoDllPlugin from 'autodll-webpack-plugin';
import * as webpack from 'webpack';

import * as CaseSensitivePathPlugin from 'case-sensitive-paths-webpack-plugin';
import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ReactLoadablePlugin } from 'react-loadable/webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import * as WebpackBar from 'webpackbar';
import * as WriteFilePlugin from 'write-file-webpack-plugin';

import paths from '../paths';

import scriptLoader from './loader/script';
import styleLoader from './loader/style';

export interface IConfig {
  dev: boolean;
  isServer: boolean;
}

export default ({
  dev = false,
  isServer = false,
}: IConfig) => {
  const webpackMode = dev ? 'development' : 'production';

  const entry = isServer ?
    {
      app: ['./src/app/server.tsx']
    } :
    {
      app: [
        'webpack-hot-middleware/client?reload=true',
        paths.appIndexJs
      ]
    };

  const webpackConfig = {
    mode: webpackMode,
    devtool: 'source-map',
    name: isServer ? 'server' : 'client',
    target: isServer ? 'node' : 'web',
    cache: true,
    entry,
    output: {
      path: path.join(paths.appBuildSrc, isServer ? 'server' : ''),
      filename: isServer ? '[name].js' : 'static/chunks/app.js',
      publicPath: '/public/',
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
      new webpack.NamedModulesPlugin(),
      !isServer && new ReactLoadablePlugin({
        filename: path.join(__dirname, '..', '..', paths.appBuild, 'react-loadable.json'),
      }),
      new WebpackBar({
        name: isServer ? 'server' : 'client'
      }),
      dev && new FriendlyErrorsWebpackPlugin(),
      dev && !isServer && new webpack.HotModuleReplacementPlugin(),
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
  return webpackConfig;
};
