const paths = require("./global.paths");

module.exports = {
  // --------------------------------------------------------------------------- WEBPACK

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
   * On dev server
   * Use proxy allow to redirect /my/path/to/dist/ to localhost:3000
   * Usefull if we are not generated html index and we want to target
   * an index.php for example.
   */
  useProxy: false,

  // --------------------------------------------------------------------------- TASKS

  /**
   * SECURITY
   * If you need to work on tasks like setup,
   * fakeMode allow to not really write/erase files.
   */
  fakeMode: false,

  /**
   * Show log done for x ms.
   */
  logDoneDelay: 1500
};