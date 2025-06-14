const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
  entry: './src/scripts/main.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
      favicon: './public/favicon.ico',
    }),
    new copyWebpackPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, './public/'),
          to: path.resolve(__dirname, 'dist/'),
          globOptions: {
            ignore: ['**/sw.js'], 
          },
        },
      ],
    }),
    new InjectManifest({
      swSrc: path.resolve(__dirname, 'public/sw.js'),
      swDest: 'sw.js',
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
};
