const webpack = require("webpack")
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserJSPlugin = require("terser-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const config = require("../global.config")

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
      filename: config.outputHashName ? `[name].[contenthash].css` : `[name].css`,
    }),

    /**
     * webpack-bundle-analyzer
     * @doc https://github.com/webpack-contrib/webpack-bundle-analyzer
     */
    ...(config.bundleAnalyzerPlugin
      ? [
          new BundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerMode: "static",
            defaultSizes: "gzip",
          }),
        ]
      : []),

    /**
     * Add progress percent on compilation logs
     */
    new webpack.ProgressPlugin(),
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
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  esModule: false,
                },
              },
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
   */
  optimization: {
    minimizer: [new TerserJSPlugin()],
  },

  stats: {
    all: false,
    assets: true,
    errors: true,
    warnings: true,
    colors: true,
    assetsSort: "size",
  },
}

// Export merge config
module.exports = merge(common, productionConfig)
