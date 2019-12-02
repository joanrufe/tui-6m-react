const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const StyleLintPlugin = require('stylelint-webpack-plugin');
const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');
const cssNano = require('cssnano');
const dotenv = require('dotenv').config();

module.exports = function webpackConfig(env) {
  return {
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    entry: {
      main: './src/main.js',
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
      filename: '[name].js',
    },
    // Development settings
    devServer: {
      hot: true,
      open: false,
      port: 3500,
      contentBase: path.resolve(__dirname, 'public/'),
      historyApiFallback: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].css',
      }),
      // Define here global variables for usage in js runtime
      new webpack.DefinePlugin({
        PRODUCTION: env.production
          ? JSON.stringify(true)
          : JSON.stringify(false),
        // attach .env file as global variable
        'process.env': JSON.stringify(dotenv.parsed),
      }),

      // More development settings
      ...(env.production
        ? []
        : [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
          ]),
    ],
    module: {
      rules: [
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            ...(env.production
              ? [MiniCssExtractPlugin.loader]
              : [
                {
                  loader: 'style-loader',
                  options: {
                    // insert: 'tui-6m-component::shadow'
                    injectType: 'singletonStyleTag',
                    insert: function insertAtTop(element) {
                      // var parentElement = document.querySelector('#host');
                      // if (!parentElement.shadowRoot) {
                      //   parentElement.attachShadow({ mode: 'open'});
                      // }
                      // var parent = parentElement.shadowRoot;
                      var parent = document.querySelector('#tui-styles');
                      // eslint-disable-next-line no-underscore-dangle
                      var lastInsertedElement =
                        window._lastElementInsertedByStyleLoader;

                      if (!lastInsertedElement) {
                        parent.insertBefore(element, parent.firstChild);
                      } else if (lastInsertedElement.nextSibling) {
                        parent.insertBefore(element, lastInsertedElement.nextSibling);
                      } else {
                        parent.appendChild(element);
                      }
                      // document.removeChild(parent);
                      // eslint-disable-next-line no-underscore-dangle
                      window._lastElementInsertedByStyleLoader = element;
                    },
                  }
                }
              ]),
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  postcssPresetEnv(),
                  cssNano(),
                ],
              },
            },
            'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                resources: path.resolve(
                  __dirname,
                  './node_modules/tui-components/lib/globals/sass-resources/index.scss',
                ),
              },
            },
          ],
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.md$/,
          loaders: ['json-loader', 'front-matter-loader'],
        },
      ],
    },
    devtool: 'source-map',
    node: {
      fs: 'empty',
    },
  };
};
