const webpack = require('webpack');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const environment = require('./environment');

const definePlugin = environment.plugins.get('Define');
definePlugin.definitions['process.env'] = {
    NODE_ENV: '"production"',
};

environment.config.merge({ devtool: 'none' });

module.exports = environment.toWebpackConfig();
