const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');

module.exports = {
  module: (isServer) => ({
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "tslint-loader",
        enforce: "pre"
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                'react-hot-loader/babel',
              ]
            }
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.css|less$/,
        use: [
          {
            loader: isServer ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
          },
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
        ],
      },
      {
        exclude: [/\.(js|jsx|mjs|tsx?)$/, /\.html$/, /\.json$/, /\.css|less$/],
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ]
  })
}