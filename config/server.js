const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const baseConfig = require('./base')

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
  mode: 'development',
  target: 'node',
  entry: './src/server.tsx',
  // context: path.resolve(__dirname, ''),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(__dirname), 'node_modules', 'app'],
    plugins: [
      new TsconfigPathsPlugin(),
      // new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
    ]
  },
  output: {
    path: path.resolve('./build/public'),
    filename: '../server.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: '/public/',
    libraryTarget: 'commonjs2'
    // devtoolModuleFilenameTemplate: info =>
    //   path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  externals: nodeModules,
  module: baseConfig.module(true),
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
    // new HtmlWebpackPlugin(),
  ],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  }
}