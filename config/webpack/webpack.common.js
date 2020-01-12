const paths = require("../paths");
const config = require("../config");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const ManifestPlugin = require("webpack-manifest-plugin");
const lessToJsPlugin = require("./plugins/less-to-js-webpack-plugin");

/**
 * Common Webpack Configuration
 */
commonConfig = {
  /**
   * Entry
   * The first place Webpack looks to start building the bundle.
   */
  entry: {
    main: `${paths.src}/index.ts`
  },

  /**
   * Output
   * Where Webpack outputs the assets and bundles.
   */
  output: {
    path: config.outputPath,
    filename: "[name].bundle.js"
    // publicPath: "/"
  },

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
      ".css"
    ],
    alias: {
      // react: "preact/compat",
      // "react-dom/test-utils": "preact/test-utils",
      // "react-dom": "preact/compat"
    },
    modules: [paths.nodeModules, paths.src]
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
     * CleanWebpackPlugin
     * Removes/cleans build folders and unused assets when rebuilding.
     */
    ...(config.cleanOutputfolder ? [new CleanWebpackPlugin()] : []),

    /**
     * HtmlWebpackPlugin
     * Generates an HTML file from a template.
     */
    ...(config.generateHtmlIndex
      ? [
          new HtmlWebpackPlugin({
            title: require("../../package").name,
            template: paths.srcCommon + "/template.html",
            filename: "index.html"
          })
        ]
      : []),

    /**
     * Dotenv Wepback
     * @doc https://github.com/mrsteele/dotenv-webpack
     */
    new Dotenv({
      path: paths.env,
      systemvars: true
    }),

    /**
     * Manifest plugin
     * @doc https://github.com/danethurber/webpack-manifest-plugin
     */
    new ManifestPlugin(),

    /**
     * Define Plugin
     */
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.DEBUG": JSON.stringify(process.env.DEBUG)
    }),

    /**
     * @name Less to Js Plugin
     * @description Custom plugin allow to generate parsed less variables,
     * and expose it in generated javascript file.
     */
    new lessToJsPlugin({
      watcher: paths.atomsFilesToWatch,
      outputPath: paths.atomsPath,
      outputFilename: paths.atomsGeneratedFilename
    })
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
        use: [{ loader: "babel-loader" }]
      },

      /**
       * Images
       * Copy image files to build folder.
       */
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
          // prevent display of src/ in filename
          // TODO pause problème avec le sprite
          context: "src"
        }
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
          // prevent display of src/ in filename
          context: "src"
        }
      }
    ]
  }
};

// export config
module.exports = commonConfig;
