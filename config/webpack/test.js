process.env.NODE_ENV = 'test'

const environment = require('./environment');

const definePlugin = environment.plugins.get('Define');
definePlugin.definitions.TESTING = JSON.stringify(true);

module.exports = environment.toWebpackConfig()
