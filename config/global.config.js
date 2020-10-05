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
   * Add hash in output file name
   * Effective in production mode only
   */
  outputHashName: true,

  /**
   * Build manifest file
   * It will contain paths to each assets served
   */
  buildManifestFile: false,

  // --------------------------------------------------------------------------- TASKS
  /**
   * Scaffolder
   */
  // Scaffold compatible folder
  componentCompatibleFolders: ["components", "pages"],

  // Scaffold bundle type
  bundleType: ["react", "dom"],

  // --------------------------------------------------------------------------- CLI CONFIG

  /**
   * SECURITY
   * If you need to work on tasks like setup,
   * fakeMode allow to not really write/erase files.
   */
  fakeMode: false,

  /**
   * Show log done for x ms.
   */
  logDoneDelay: 1100,
};
