const appRoot = require("app-root-path");
const paths = require("../../global.paths");

module.exports = {
  // bundle path
  bundlePath: paths.src,

  // Skeletons path
  templatesPath: appRoot.resolve("config/tasks/scaffold/templates"),

  // Scaffold compatible folder
  componentCompatibleFolders: ["components", "pages"],

  // Scaffold bundle type
  bundleType: ["react", "dom"]
};
