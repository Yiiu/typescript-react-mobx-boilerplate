const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;

const baseConfig = require('./base')

const publicPath = '/public/';

const publicUrl = '';

const devMode = process.env.NODE_ENV !== 'production'

const env = getClientEnvironment(publicUrl);
module.exports = {
  mode: 'development',
  entry: {
    // require.resolve('react-dev-utils/webpackHotDevClient'),
    app: [
      'webpack-hot-middleware/client?reload=true',
      paths.appIndexJs
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'styles': paths.appStyles
    },
    plugins: [
      new TsconfigPathsPlugin(),
      // new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
    ]
  },
  output: {
    path: path.resolve(`./${paths.appBuild}/client`),
    pathinfo: true,
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: publicPath,
    // devtoolModuleFilenameTemplate: info =>
    //   path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  module: baseConfig.module(false),
  plugins: [
    // new CleanWebpackPlugin(['./__server'], { root: process.cwd() }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    new webpack.NamedModulesPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new ReactLoadablePlugin({
      filename: 'react-loadable.json',
    }),
    // new webpack.NamedModulesPlugin(),
    // new HtmlWebpackPlugin(),
  ]
}