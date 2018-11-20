const merge = require('webpack-merge');
const path = require('path');

const common = require('./base.config.js');

module.exports = merge(common, {
  devtool: 'eval-source-map',
  output: {
    filename: 'embed.js',
    path: path.resolve(__dirname, '..', '..', 'dist')
  },
});
