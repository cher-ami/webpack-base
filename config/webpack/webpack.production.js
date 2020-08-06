const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

// ----------------------------------------------------------------------------- GLOBAL

const paths = require("../global.paths");
const config = require("../global.config");

// ----------------------------------------------------------------------------- CONFIG

/**
 * Production Webpack Configuration
 */
const productionConfig = {
  /**
   * Mode
   * Set the mode to development or production.
   */
  mode: "production",

  output: {
    path: config.outputPath,
    filename: config.outputHashName
      ? `[name].[contenthash].bundle.js`
      : `[name].bundle.js`,
    // need production APP_BASE, for that, set a ".env.production" with APP_BASE value.
    // if .env.production doesn't exist, APP_BASE from ".env" will be used
    publicPath: process.env.APP_BASE,
  },

  /**
   * Plugins
   */
  plugins: [
    /**
     * MiniCssExtractPlugin
     * Extracts CSS into separate files.
     * Note: style-loader is for development, MiniCssExtractPlugin is for production.
     * They cannot be used together in the same config.
     */
    new MiniCssExtractPlugin({
      filename: config.outputHashName
        ? `[name].[contenthash].css`
        : `[name].css`,
    }),

    /**
     * webpack-bundle-analyzer
     * @doc https://github.com/webpack-contrib/webpack-bundle-analyzer
     *
     */
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: "static",
      defaultSizes: "gzip",
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
   * Modules
   */
  module: {
    rules: [
      /**
       * Styles
       * Extract CSS
       */
      {
        test: /\.(less|css)$/,
        oneOf: [
          {
            test: /\.module\.(less|css)$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  sourceMap: false,
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
          {
            use: [
              MiniCssExtractPlugin.loader,
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
   * Optimization
   * Production minimizing of JavaSvript and CSS assets.
   */
  optimization: {
    minimizer: [
      new TerserJSPlugin(),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.main\.css$/g,
      }),
    ],
  },
};

// Export merge config
module.exports = merge(common, productionConfig);
