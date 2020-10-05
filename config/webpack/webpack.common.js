const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const lessToJsPlugin = require("./plugins/less-to-js-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const url = require("url");

// ----------------------------------------------------------------------------- GLOBAL

const paths = require("../global.paths");
const config = require("../global.config");

// ----------------------------------------------------------------------------- CONFIG

/**
 * Common Webpack Configuration
 */
commonConfig = {
  /**
   * Entry
   * The first place Webpack looks to start building the bundle.
   */
  entry: `${paths.src}/index.ts`,

  /**
   * Resolve
   */
  resolve: {
    extensions: [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".json",
      ".module.less",
      ".less",
      ".css",
    ],
    alias: {},
    modules: [paths.nodeModules, paths.src],
  },

  /**
   * Plugins
   * Customize the Webpack build process.
   */
  plugins: [
    /**
     * Progress Plugin
     * @doc https://webpack.js.org/plugins/progress-plugin/
     */
    new webpack.ProgressPlugin(),

    /**
     * @note Compile TS to js process is allowing by babel-loader with no type check
     * About react hot loader works, we need to separate type check process
     * @doc https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
     * @doc https://github.com/gaearon/react-hot-loader#typescript
     */
    new ForkTsCheckerWebpackPlugin({ async: false }),

    /**
     * HtmlWebpackPlugin
     * Generates an HTML file from a template.
     */
    ...(config.generateHtmlIndex
      ? [
          new HtmlWebpackPlugin({
            title: require("../../package").name,
            template: paths.webpackTemplatePath + "/index.html.template",
            filename: "index.html",
          }),
        ]
      : []),

    /**
     * Dotenv Wepback
     * @doc https://github.com/mrsteele/dotenv-webpack
     */
    new Dotenv({
      path: paths.env,
      systemvars: true,
    }),

    /**
     * Manifest plugin
     * @doc https://github.com/danethurber/webpack-manifest-plugin
     */
    ...(config.buildManifestFile ? [new ManifestPlugin()] : []),

    /**
     * Define Plugin
     */
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.DEBUG": JSON.stringify(process.env.DEBUG),
      "process.env.APP_BASE": JSON.stringify(process.env.APP_BASE),
      "process.env.APP_URL": JSON.stringify(process.env.APP_URL),
    }),

    /**
     * @name Less to Js Plugin
     * @description Custom plugin allow to generate parsed less variables,
     * and expose it in generated javascript file.
     */
    new lessToJsPlugin({
      watcher: paths.atomsFilesToWatch,
      outputPath: paths.atomsPath,
      outputFilename: paths.atomsGeneratedFilename,
    }),
  ],

  /**
   * Module
   * Determine how modules within the project are treated.
   */
  module: {
    rules: [
      /**
       * JavaScript
       * Use Babel to transpile JavaScript files.
       */
      {
        test: /\.(js|jsx|ts|tsx|mjs)$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }],
      },

      /**
       * Images
       * Copy image files to build folder.
       */
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|mp4)$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
          // prevent display of "src/common/" in filename
          context: "src",
          publicPath: url.resolve(
            process.env.APP_BASE || "",
            process.env.ASSETS_PATH
          ),
        },
      },

      /**
       * Fonts
       * Inline font files.
       */
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        loader: "url-loader",
        options: {
          limit: 8192,
          name: "[path][name].[ext]",
          // prevent display of "src/common/" in filename
          context: "src",
          publicPath: url.resolve(
            process.env.APP_BASE || "",
            process.env.ASSETS_PATH
          ),
        },
      },

      /**
       * Raw file
       * Load inline files in bundle
       * doc: https://www.npmjs.com/package/raw-loader
       */
      {
        test: /\.svg$/,
        use: "raw-loader",
      },
    ],
  },
};

// export config
module.exports = commonConfig;
