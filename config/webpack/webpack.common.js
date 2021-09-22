const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const Dotenv = require("dotenv-webpack")
const lessToJsPlugin = require("./plugins/less-to-js-webpack-plugin")
const { WebpackManifestPlugin } = require("webpack-manifest-plugin")
const paths = require("../global.paths")
const config = require("../global.config")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const path = require("path")

const APP_BASE = process.env.APP_BASE

/**
 * Common Webpack Configuration
 */
const commonConfig = {
  /**
   * Entry
   * The first place Webpack looks to start building the bundle.
   */
  entry: [`${paths.src}/index.tsx`],

  /**
   * Resolve
   */
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".module.less", ".less", ".css"],
    alias: {},
    modules: ["src", "node_modules"],
  },

  /**
   * Plugins
   * Customize the Webpack build process.
   */
  plugins: [
    /**
     * Compile TS to js process is allowing by esbuild-loader with no type check
     * This plugin allow only type checking part of the process
     * @doc https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
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
            base: APP_BASE?.endsWith("/") ? APP_BASE : APP_BASE + "/",
            template: paths.src + "/index.html",
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
    ...(config.buildManifestFile ? [new WebpackManifestPlugin()] : []),

    /**
     * Define Plugin
     */
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.DEBUG": JSON.stringify(process.env.DEBUG),
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

    /**
     * CopyWebpackPlugin
     * Copies files from target to destination folder.
     * @doc https://webpack.js.org/plugins/copy-webpack-plugin/
     */
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.publicPath,
          to: path.join(config.outputPath, "public"),
          globOptions: {
            ignore: ["*.DS_Store", ".gitkeep", ".*"],
          },
        },
      ],
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
    ],
  },
}

module.exports = commonConfig
