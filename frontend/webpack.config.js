const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const path = require("path");
const prefixer = require("postcss-prefixer");
const prefixerSelector = require("postcss-prefix-selector");
const postcssPresetEnv = require("postcss-preset-env");
const cssNano = require("cssnano");
const dotenv = require("dotenv").config();
const styleNamespace = require("../../namespace");

module.exports = function webpackConfig(env) {
  return {
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"]
    },
    entry: {
      index: "index.html",
      vendor: ["react", "react-dom"]
    },
    output: {
      path: path.resolve(__dirname, "../../html/"),
      publicPath: "/",
      filename: "[name].[hash].js"
    },
    // Development settings
    devServer:
      !env.production && dotenv && dotenv.parsed
        ? {
            hot: true,
            open: false,
            contentBase: path.resolve(__dirname, "public/"),
            historyApiFallback: true,
            proxy: {
              "/api/holidays": {
                target: dotenv.parsed.TDA_API_URL,
                changeOrigin: true,
                secure: false,
                logLevel: "debug",
                pathRewrite: rewritePath => {
                  return rewritePath.replace("/api/", "/v1/");
                }
              },
              "/api/tuf": {
                target: dotenv.parsed.API_URL,
                changeOrigin: true,
                secure: false,
                logLevel: "debug"
              }
            }
          }
        : {},
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/styleguide/index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      // Define here global variables for usage in js runtime
      new webpack.DefinePlugin({
        PRODUCTION: env.production
          ? JSON.stringify(true)
          : JSON.stringify(false),
        // attach .env file as global variable
        "process.env": JSON.stringify(dotenv.parsed)
      }),

      // More development settings
      ...(env.production
        ? []
        : [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin()
          ])
    ],
    module: {
      rules: [
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader"
            }
          ]
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            ...(env.production
              ? [MiniCssExtractPlugin.loader]
              : ["style-loader"]),
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [
                  prefixer({
                    prefix: styleNamespace.prefix
                  }),
                  prefixerSelector({
                    prefix: styleNamespace.rootClass
                      ? `.${styleNamespace.prefix}${styleNamespace.rootClass}`
                      : ""
                  }),
                  postcssPresetEnv(),
                  cssNano()
                ]
              }
            },
            "sass-loader",
            {
              loader: "sass-resources-loader",
              options: {
                resources: path.resolve(
                  __dirname,
                  "./node_modules/tui-components/lib/globals/sass-resources/index.scss"
                )
              }
            }
          ]
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        }
      ]
    },
    devtool: "source-map",
    node: {
      fs: "empty"
    },
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    }
  };
};
