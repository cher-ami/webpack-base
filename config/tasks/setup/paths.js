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
   * external folder Paths
   */
  // .env
  env: globalPaths.env,
  // .env.example
  envExample: globalPaths.envExample,
  // root readme
  readme: globalPaths.readme,
  // install.config
  installConfig: globalPaths.installConfig,
  // .gitigore
  gitignore: globalPaths.gitignore,
  // .git
  gitFolder: globalPaths.gitFolder,
  // install script
  installScript: globalPaths.installScript
};
