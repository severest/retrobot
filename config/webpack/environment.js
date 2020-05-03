const { environment } = require('@rails/webpacker');
const webpack = require('webpack');

environment.plugins.prepend(
    'ContextReplacement',
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
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
