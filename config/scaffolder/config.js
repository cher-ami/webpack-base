const appRoot = require("app-root-path");

module.exports = {
  // Skeletons path
  templatesPath: appRoot.resolve("config/scaffolder/templates"),

  // Scaffold compatible folder
  componentCompatibleFolders: ["components", "pages", "views"],

  // Scaffold bundle type
  bundleType: ["dom", "react"]
};
