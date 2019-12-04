const appRoot = require("app-root-path");

module.exports = {
  // src folder
  src: appRoot.resolve("src"),

  // dist folder
  dist: appRoot.resolve("dist"),

  // static folder
  static: appRoot.resolve("dist/static"),

  // node modules
  nodeModules: appRoot.resolve("node_modules"),

  // .env file
  env: appRoot.resolve(".env"),

  // Images folder
  imagesFolder: "images/",

  // Path to fonts folder from src
  fontsPath: appRoot.resolve("src/fonts/"),

  // Font folder
  fontsFolder: "fonts/",

  // Fonts style file path
  fontsStyleFile: "Fonts.less",

  // Atoms folder
  atomsFolder: "atoms/",

  // Name of export atoms file
  atomsTypescriptFile: "Atoms.js",

  // Skeletons path
  skeletonsPath: appRoot.resolve("config/skeletons/")
};
