const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const cssNano = require('cssnano');

module.exports = function webpackConfig(env) {
  return {
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    entry: {
      main: path.resolve(__dirname, './main.js'),
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
      port: 3000,
      historyApiFallback: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './index.html'),
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
          loader: 'file-loader',
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
                      injectType: 'singletonStyleTag',
                      insert: function insertAtTop(element) {
                        const parent = document.querySelector('#tui-styles');
                        parent.appendChild(element);
                      },
                    },
                  },
                ]),
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [postcssPresetEnv(), cssNano()],
              },
            },
          ],
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
    devtool: 'source-map',
    node: {
      fs: 'empty',
    },
  };
};
