const paths = require("../paths");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  /**
   * Entry
   * The first place Webpack looks to start building the bundle.
   */
  entry: {
    main: paths.src + "/Main.tsx"
  },

  /**
   * Output
   * Where Webpack outputs the assets and bundles.
   */
  output: {
    path: paths.dist,
    filename: "[name].bundle.js",
    publicPath: "/"
  },

  /**
   * Resolve
   */
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", "less", "css"],
    alias: {
      "react-dom": "@hot-loader/react-dom"
    },
    modules: [paths.node_modules, paths.src]
  },

  /**
   * Plugins
   * Customize the Webpack build process.
   */
  plugins: [
    /**
     * @note Compile ts to js process is allowing by babel-loader with no type check
     * About react hot reload works, we need to separate type check process
     * @doc https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
     * @doc https://github.com/gaearon/react-hot-loader#typescript
     */
    new ForkTsCheckerWebpackPlugin({ async: false }),

    /**
     * CleanWebpackPlugin
     * Removes/cleans build folders and unused assets when rebuilding.
     */
    new CleanWebpackPlugin(),

    /**
     * HtmlWebpackPlugin
     * Generates an HTML file from a template.
     */
    new HtmlWebpackPlugin({
      title: "Webpack base",
      favicon: paths.src + "/images/favicon.png",
      template: paths.src + "/template.html",
      filename: "index.html"
    }),

    /**
     * Define Plugin
     */
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.DEBUG": JSON.stringify(process.env.DEBUG)
    }),

    new webpack.ProvidePlugin({
      $: "zepto-webpack"
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
       * Styles
       * Inject CSS into the head with source maps.
       */
      {
        test: /\.(less|css)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { sourceMap: true, importLoaders: 1 }
          },
          { loader: "postcss-loader", options: { sourceMap: true } },
          { loader: "less-loader", options: { sourceMap: true } }
        ]
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
