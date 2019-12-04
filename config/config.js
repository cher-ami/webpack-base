const paths = require("./paths");

module.exports = {
  /**
   * Output Path
   * Where assets and bundle are build in production
   * (à voir si on doit faire la même chose pour le dev server)
   */
  outputPath: paths.dist,

  /**
   * Generate an index.html from template /src/template.html
   */
  generateHtmlIndex: true,

  /**
   * Scaffold compatible folder
   */
  componentCompatibleFolders: ["components", "pages", "views"]
};
