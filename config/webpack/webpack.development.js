const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const paths = require("../global.paths");
const config = require("../global.config");
const ip = require("internal-ip");
const portFinderSync = require("portfinder-sync");
require("colors");

// test env
const DEV_SERVER_OPEN = process.env.DEV_SERVER_OPEN === "true";
const DEV_SERVER_HOT_RELOAD = process.env.DEV_SERVER_HOT_RELOAD === "true";
const ENABLE_DEV_PROXY = process.env.ENABLE_DEV_PROXY === "true";

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
    watchContentBase: true,
    contentBase: paths.dist,
    port: process.env.DEV_SERVER_PORT || portFinderSync.getPort(3000),
    inline: true,
    compress: true,
    https: false,
    useLocalIp: true,
    historyApiFallback: true,
    host: "0.0.0.0",
    disableHostCheck: true,
    // reload/refresh the page when file changes are detected
    hot: DEV_SERVER_HOT_RELOAD,
    liveReload: DEV_SERVER_HOT_RELOAD,
    // open new browser tab when webpack dev-server is started
    open: DEV_SERVER_OPEN,
    // Write file to dist on each compile
    writeToDisk: true,
    // display error overlay on screen
    overlay: true,
    // stats to print in console
    noInfo: false,
    stats: "minimal",
    // pass to true if you don't want to print compile file in the console
    quiet: false,
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

    after: (app, server) => {
      const port = server.options.port;
      const https = server.options.https ? "s" : "";
      const localIp = ip.v4.sync();
      const localDomain = `http${https}://localhost:${port}`;
      const networkDomain = `http${https}://${localIp}:${port}`;

      console.clear();

      const template = [
        `\n`,
        `${`Serving! `.bold.cyan}`,
        ``,
        `- ${`Local:`.bold}         ${localDomain.cyan}`,
        `- ${`Network:`.bold}       ${networkDomain.cyan}`,
        ``,
      ].join(`\n`);

      console.log(template);
    },
  },
};

// Export merge config
module.exports = merge(common, developmentConfig);
