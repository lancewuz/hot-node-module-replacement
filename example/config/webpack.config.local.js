'use strict';

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const configBase = require('./webpack.config.base');
const publicPath = `/dist/`;

let plugins = configBase.plugins;
plugins = plugins.concat([
  new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[id].css"
  })
]);

const configLocal = {
  mode: 'none',
  devServer: {
    publicPath,
    hot: true,
    hotOnly: true,
    quiet: false,
    noInfo: false
  },
  output: {
    path: path.join(__dirname, '../static/dist'),
    filename: '[name].js',
    chunkFilename: `[name].[id].js`,
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
              name: 'static/media/[name].[ext]',
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
                loader: require.resolve('css-hot-loader')
              },
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
              name: 'static/media/[name].[ext]',
            },
          },
        ],
      }
    ],
  },
  plugins
};

const config = Object.assign({}, configBase, configLocal);
module.exports = config;
