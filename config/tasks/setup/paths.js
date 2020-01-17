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
  templatesFolder: `${localRoot}/templates`,

  // --------------------------------------------------------------------------- GLOBAL

  /**
   * Path from route config/ folder
   */
  // env file path
  env: globalPaths.env,
  // env example file path
  envExample: globalPaths.envExample,
  // global root readme
  readme: globalPaths.readme,
  // install.config path file
  installConfig: globalPaths.installConfig,
  // gitigore
  gitignore: globalPaths.gitignore
};
