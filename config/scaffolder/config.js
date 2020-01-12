const appRoot = require("app-root-path");

module.exports = {
  //outPutFolder: appRoot.resolve("src"),

  // Skeletons path
  templatesPath: appRoot.resolve("config/scaffolder/templates"),

  // Scaffold compatible folder
  componentCompatibleFolders: ["components", "pages", "views"],

  // Scaffold bundle type
  bundleType: ["dom", "react"]
};
