const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

// ----------------------------------------------------------------------------- GLOBAL

const paths = require("../global.paths");
const config = require("../global.config");

// test env
const CONSOLE_PRINT_FRIENDLY = process.env.CONSOLE_PRINT === "friendly";
const DEV_SERVER_OPEN = process.env.DEV_SERVER_OPEN === "true";
const ENABLE_DEV_PROXY = process.env.ENABLE_DEV_PROXY === "true";

// ----------------------------------------------------------------------------- CONFIG

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
   */
  devtool: "source-map",

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
                  sourceMap: true,
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
     * Friendly error
     * @doc https://github.com/geowarin/friendly-errors-webpack-plugin
     */
    ...(CONSOLE_PRINT_FRIENDLY
      ? [
          new FriendlyErrorsPlugin({
            clearConsole: true,
          }),
        ]
      : []),
    /**
     * React Fast Refresh
     * @doc https://github.com/pmmmwh/react-refresh-webpack-plugin
     * IMPORTANT: this is a beta version but work fine
     */
    new ReactRefreshWebpackPlugin({
      forceEnable: false,
    }),

    /**
     * Enables Hot Module Replacement, otherwise known as HMR
     * @doc https://webpack.js.org/plugins/hot-module-replacement-plugin/
     */
    new webpack.HotModuleReplacementPlugin(),
  ],

  /**
   * DevServer
   * Spin up a server for quick development.
   */
  devServer: {
    contentBase: paths.dist,
    port: parseInt(process.env.DEV_SERVER_PORT) || 3000,
    hot: true,
    inline: true,
    compress: true,
    historyApiFallback: true,

    // open new browser tab when webpack dev-server is started
    open: DEV_SERVER_OPEN,
    // Write file to dist on each compile
    writeToDisk: true,
    // display error overlay on screen
    overlay: true,
    // stats to print in console
    stats: {
      all: false,
      errors: !CONSOLE_PRINT_FRIENDLY,
      warnings: !CONSOLE_PRINT_FRIENDLY,
      colors: !CONSOLE_PRINT_FRIENDLY,
    },
    // friendly webpack error
    // pass to true if you don't want to print compile file in the console
    quiet: CONSOLE_PRINT_FRIENDLY,

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
