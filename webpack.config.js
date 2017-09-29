const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          'babel-loader',
          // 'eslint-loader',
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|woff(2)?|ttf|eot)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
      }
    ]
  },
  devServer: {
    proxy: {
      '/api': "http://localhost:3000"
    },
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
    }),
    new HtmlWebpackPlugin({
      template: './client/index.ejs',
    }),
    extractSass
  ],
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  module.exports.output.path = path.resolve(__dirname, './public/dist');
  module.exports.output.publicPath = '/public/dist/';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}
