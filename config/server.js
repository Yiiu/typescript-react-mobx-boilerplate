const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const merge = require('webpack-merge');

const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;

const baseConfig = require('./base')

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: './src/app/server.tsx',
  devtool: 'source-map',
  target: 'node',
  // context: path.resolve(__dirname, ''),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // modules: [path.resolve(__dirname), 'node_modules', 'app'],
    alias: {
      'styles': paths.appStyles
    },
    plugins: [
      new TsconfigPathsPlugin(),
      // new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
    ]
  },
  output: {
    path: path.resolve(`./${paths.appBuild}/server`),
    filename: 'entry-server.js',
    publicPath: '/public/',
    libraryTarget: 'commonjs',
    chunkFilename: '[name].chunk.js'
    // devtoolModuleFilenameTemplate: info =>
    //   path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  externals: nodeModules,
  module: {
    rules: [
      {
        test: /\.css|less$/,
        use: [
          // {
          //   loader: MiniCssExtractPlugin.loader
          // },
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[local]_[hash:base64:8]'
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: require.resolve('less-loader'),
            // options: {
            //   modifyVars: theme
            // }
          }
        ]
      },
    ],
  },
  plugins: [
    // new ForkTsCheckerWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: "../client/static/css/[name].css",
    //   chunkFilename: "[id].css"
    // }),
    new ReactLoadablePlugin({
      filename: path.join(__dirname, '..', paths.appBuild, 'react-loadable.json'),
    })
    // new HtmlWebpackPlugin(),
  ]
})
