const paths = require("../paths");
const config = require("../config");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
    filename: "[name].[contenthash].bundle.js"
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
      filename: "[name].[contenthash].css"
      //chunkFilename: "[id].css"
    }),

    /**
     * CopyWebpackPlugin
     * Copies files from target to destination folder.
     */
    new CopyWebpackPlugin([
      {
        from: config.outputPath,
        to: "/",
        ignore: ["*.DS_Store"]
      }
    ])
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
                    localIdentName: "[name]__[local]--[hash:base64:5]"
                  }
                }
              },
              "postcss-loader",
              "less-loader"
            ]
          },
          {
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              "postcss-loader",
              "less-loader"
            ]
          }
        ]
      }
    ]
  },

  /**
   * Optimization
   * Production minimizing of JavaSvript and CSS assets.
   */
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },

  stats: {
    all: false,
    assets: true
  }
};

// Export merge config
module.exports = merge(common, productionConfig);
