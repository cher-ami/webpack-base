const webpack = require("webpack")
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const config = require("../global.config")
require("colors")

/**
 * Development Webpack Configuration
 */
const developmentConfig = {
  /**
   * Mode
   * Set the mode to development or production.
   */
  mode: "development",

  output: {
    path: config.outputPath,
    filename: "[name].bundle.js",
    publicPath: process.env.APP_BASE,
  },

  /**
   * Devtool
   * Control how source maps are generated.
   * doc: https://webpack.js.org/configuration/devtool
   */
  devtool: process.env.WEBPACK_DEV_TOOL || false,

  /**
   * Modules
   */
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
            options: { plugins: ["react-refresh/babel"] },
          },
        ],
      },
      /**
       * Styles
       * Inject CSS into the head with source maps.
       */
      {
        test: /\.(less|css)$/,
        oneOf: [
          // if it's a module
          {
            test: /\.module\.(less|css)$/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  sourceMap: !!process.env.WEBPACK_DEV_TOOL,
                  importLoaders: 1,
                  modules: {
                    localIdentName: "[name]__[local]--[hash:base64:5]",
                  },
                },
              },
              "postcss-loader",
              "less-loader",
            ],
          },
          // else if it's a simple less or css file
          {
            use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
          },
        ],
      },
    ],
  },

  /**
   * Plugins
   */
  plugins: [
    /**
     * Enables Hot Module Replacement, otherwise known as HMR
     * @doc https://webpack.js.org/plugins/hot-module-replacement-plugin/
     */
    new webpack.HotModuleReplacementPlugin(),

    /**
     * React Fast Refresh
     * @doc https://github.com/pmmmwh/react-refresh-webpack-plugin
     */
    new ReactRefreshWebpackPlugin({
      forceEnable: false,
      overlay: false,
    }),
  ],
}

// Export merge config
module.exports = merge(common, developmentConfig)
