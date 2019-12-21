const paths = require("../paths");
const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

/**
 * Development Webpack Configuration
 */
const developmentConfig = {
  /**
   * Mode
   * Set the mode to development or production.
   */
  mode: "development",

  /**
   * Devtool
   * Control how source maps are generated.
   */
  devtool: "source-map",

  module: {
    rules: [
      /**
       * JavaScript
       * Use Babel to transpile JavaScript files.
       * Overwrite common config to add react-refresh/babel only on development
       */
      {
        test: /\.(js|jsx|ts|tsx|mjs)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: { plugins: ["react-refresh/babel"] }
          }
        ]
      }
    ]
  },

  plugins: [
    /**
     * Friendly error
     * @doc https://github.com/geowarin/friendly-errors-webpack-plugin
     */
    new FriendlyErrorsPlugin({
      clearConsole: true
    }),

    /**
     * React Fast Refresh
     * @doc https://github.com/pmmmwh/react-refresh-webpack-plugin
     * IMPORTANT: this is a beta version but work fine
     */
    new ReactRefreshWebpackPlugin({
      disableRefreshCheck: true,
      forceEnable: false
    }),

    /**
     * Enables Hot Module Replacement, otherwise known as HMR
     * @doc https://webpack.js.org/plugins/hot-module-replacement-plugin/
     */
    new webpack.HotModuleReplacementPlugin(),

    /**
     * The HtmlWebpackPlugin simplifies creation of HTML files to serve your webpack bundles.
     * @doc https://webpack.js.org/plugins/html-webpack-plugin/
     */
    new HtmlWebpackPlugin({
      title: "Webpack base",
      favicon: paths.src + "/images/favicon.png",
      template: paths.src + "/template.html",
      filename: "index.html"
    })
  ],

  /**
   * DevServer
   * Spin up a server for quick development.
   */
  devServer: {
    contentBase: paths.dist,
    port: 3000,
    open: false,
    hot: true,
    inline: true,
    compress: true,
    writeToDisk: false,
    historyApiFallback: true,

    // display error overlay on screen
    overlay: true,

    stats: {
      all: false,
      assets: true
    },

    // friendly webpack error
    // pass to true if you don't want to print compile file in the console
    quiet: true
  }
};

// Export merge config
module.exports = merge(common, developmentConfig);
