const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {

  return {
    mode: 'development',
    entry: [
      './src/index.js',
    ],
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, './dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        hash: true,
      })
    ],
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, './'),
        ],
      }],
    },
    devServer: {
      publicPath: '/',
      contentBase: './dist',
      open: true,
    },
  };
};