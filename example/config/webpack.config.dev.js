'use strict';

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const configBase = require('./webpack.config.base');
const publicPath = `/dist/`;

let plugins = configBase.plugins;
plugins = plugins.concat([
  new MiniCssExtractPlugin({
    filename: "[name].[hash:6].css",
    chunkFilename: "[id].[hash:6].css"
  }),
]);

const configDev = {
  mode: 'development',
  output: {
    path: path.join(__dirname, '../static/dist'),
    filename: '[name].[hash:6].js',
    chunkFilename: `[name].[hash:6].[id].js`,
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:6].[ext]',
            },
          },
          {
            test: /\.(js|jsx)$/,
            include: [
              path.join(__dirname, '../client'),
            ],
            loader: require.resolve('babel-loader'),
          },
          {
            test: [/\.css$/, /\.scss$/],
            use: [
              {
                loader: MiniCssExtractPlugin.loader
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('sass-loader'),
                options: {
                  sourceMap: true,
                },
              }
            ],
          },
          {
            exclude: [/\.js$/, /\.jsx$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:6].[ext]',
            },
          },
        ],
      }
    ],
  },
  plugins
};

const config = Object.assign({}, configBase, configDev);
module.exports = config;
