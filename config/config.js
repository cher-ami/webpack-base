const paths = require("./paths");

module.exports = {
  /**
   * Entry point
   * Can be an array too.
   * @type {string|string[]}
   */
  entryFileName: "Main.tsx",

  /**
   * Output FileName
   * Format name only for production mode
   *  - [name] take "main" string by default
   *  - [contenthash] add hash in file name
   * @type {string}
   */
  outputFileName: "[name].[contenthash].bundle.js",

  /**
   * Output Path
   * Where assets and bundle are build in production
   * (à voir si on doit faire la même chose pour le dev server)
   */
  outputPath: paths.static,

  /**
   * Generate an index.html from template /src/template.html
   */
  generateHtmlIndex: true
};
