const merge = require('webpack-merge');
const common = require('./base.config.js');

module.exports = merge(common, {
  devtool: 'source-map',
});
