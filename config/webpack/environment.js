const path = require('path');
const { environment } = require('@rails/webpacker');
const webpack = require('webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

environment.plugins.prepend(
    'ContextReplacement',
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
);
environment.plugins.prepend(
    'Favicons',
    new FaviconsWebpackPlugin({
        logo: path.resolve(__dirname, '../../logo.png'),
        inject: false,
        cache: false,
        favicons: {
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
        }
    })
);
environment.plugins.prepend(
    'Define',
    new webpack.DefinePlugin({
        TESTING: JSON.stringify(false),
    })
);

environment.splitChunks((config) => Object.assign({}, config, {
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: { test: /[\\/]node_modules[\\/]/, name: "vendors", chunks: "all" }
            }
        }
    }
}));

environment.config.merge({ devtool: 'cheap-module-eval-source-map' });

module.exports = environment;
