const appRoot = require("app-root-path");

module.exports = {
  // bundle path
  bundlePath: appRoot.resolve("src"),

  // Skeletons path
  templatesPath: appRoot.resolve("config/scaffolder/templates"),

  // Scaffold compatible folder
  componentCompatibleFolders: ["components", "pages"],

  // Scaffold bundle type
  bundleType: ["react", "dom"]
};
