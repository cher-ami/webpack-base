const paths = require('../paths')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');


module.exports = merge(common, {
  /**
   * Mode
   *
   * Set the mode to development or production.
   */
  mode: 'development',

  /**
   * Devtool
   *
   * Control how source maps are generated.
   */
  devtool: 'inline-source-map',

  plugins: [

    new FriendlyErrorsPlugin({
      clearConsole: true
    })
  ],

  /**
   * DevServer
   *
   * Spin up a server for quick development.
   */
  devServer: {
    contentBase: paths.dist,
    open: false,
    compress: true,
    hot: true,
    port: 3000,

    // display error overlay on screen
    overlay: true,

    stats: {
       all: false,
       assets: true
    },

    // friendly webpack error
    // https://github.com/geowarin/friendly-errors-webpack-plugin
    // pass to true if you don't want to print compile file in the console
     quiet: false,
  }

});
