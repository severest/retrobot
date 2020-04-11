const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "[name].[hash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: './client/main.js',
  output: {
    filename: "[name].[hash].bundle.js",
    publicPath: '/',
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
    host: '0.0.0.0',
    proxy: {
      '/api': "http://localhost:3000",
      '/cable': {
        target: "ws://localhost:3000",
        ws: true
      }
    },
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.ejs',
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, './logo.png'),
      inject: true,
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    extractSass
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: { test: /[\\/]node_modules[\\/]/, name: "vendors", chunks: "all" }
      }
    }
  },
}

if (process.env.NODE_ENV === 'production') {
  module.exports.output.path = path.resolve(__dirname, './public');
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
} else {
  module.exports.devtool = 'cheap-module-eval-source-map';
}
