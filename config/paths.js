const appRoot = require('app-root-path');

module.exports = {
  src: appRoot.resolve('src'),
  static: appRoot.resolve('static'),
  dist: appRoot.resolve('dist'),
  node_modules: appRoot.resolve('node_modules'),

};
