const globalPaths = require("../../global.paths");

// target local root
const localRoot = `${globalPaths.tasks}/setup`;

module.exports = {
  // --------------------------------------------------------------------------- LOCAL

  /**
   * Inside this task folder
   */

  // local root path
  localRootPath: localRoot,

  // local templates folder path
  localTemplatesPath: `${localRoot}/templates`,

  // --------------------------------------------------------------------------- GLOBAL

  /**
   *  On Route project
   */

  // global root readme
  readmeFilePath: `${globalPaths.root}/README.md`
};
