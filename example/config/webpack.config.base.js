'use strict';

const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  target: 'web',
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, './'),
  entry: {
    home: ['../client/entry/home'],
  },
  resolve: {
    modules: [
      'client',
      'node_modules',
      'static'
    ],
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new CleanWebpackPlugin(
      ['./static/dist/*'],
      {
        root: path.join(__dirname, '../')
      }
    ),
    new AssetsPlugin({
      path: path.join(__dirname, '../tmpDist'),
      filename: 'assets.json',
      update: true,
    })
  ]
};
