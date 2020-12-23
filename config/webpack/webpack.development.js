const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const paths = require("../global.paths");
const config = require("../global.config");

// test env
const DEV_SERVER_OPEN = process.env.DEV_SERVER_OPEN === "true";
const DEV_SERVER_HOT_RELOAD = process.env.DEV_SERVER_HOT_RELOAD === "true";
const ENABLE_DEV_PROXY = process.env.ENABLE_DEV_PROXY === "true";
const ENABLE_SOURCE_MAP = process.env.ENABLE_SOURCE_MAP === "true";

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
  devtool: ENABLE_SOURCE_MAP ? "source-map" : false,

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
                  sourceMap: ENABLE_SOURCE_MAP,
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
            use: [
              "style-loader",
              "css-loader",
              "postcss-loader",
              "less-loader",
            ],
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
    }),
  ],

  /**
   * DevServer
   * Spin up a server for quick development.
   */
  devServer: {
    publicPath: "",
    contentBase: paths.dist,
    port: parseInt(process.env.DEV_SERVER_PORT) || 3000,
    hot: DEV_SERVER_HOT_RELOAD,
    inline: true,
    compress: true,
    historyApiFallback: true,
    // reload/refresh the page when file changes are detected
    liveReload: DEV_SERVER_HOT_RELOAD,
    // open new browser tab when webpack dev-server is started
    open: DEV_SERVER_OPEN,
    // Write file to dist on each compile
    writeToDisk: true,
    // display error overlay on screen
    overlay: false,
    // stats to print in console
    stats: {
      all: false,
      errors: true,
      warnings: true,
      colors: true,
    },
    // pass to true if you don't want to print compile file in the console
    quiet: false,

    // Specify a host to use. If you want your server to be accessible externally
    // https://webpack.js.org/configuration/dev-server/#devserverhost
    ...(process.env.DEV_SERVER_HOST
      ? { host: process.env.DEV_SERVER_HOST }
      : {}),

    // specify to enable root proxying
    index: "",
    // if use proxy option is enable
    ...(ENABLE_DEV_PROXY
      ? {
          proxy: {
            "/": {
              // target url like http://localhost/project/dist/base-path/
              target: process.env.PROXY_URL,
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : {}),
  },
};

// Export merge config
module.exports = merge(common, developmentConfig);
