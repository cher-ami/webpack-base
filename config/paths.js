const appRoot = require("app-root-path");

module.exports = {
  // root folder
  root: appRoot.resolve(""),

  // src folder
  src: appRoot.resolve("src"),

  common: appRoot.resolve("src/common"),

  // dist folder
  dist: appRoot.resolve("dist"),

  // static folder
  static: appRoot.resolve("dist/static"),

  // config folder
  config: appRoot.resolve("config"),

  configWebpackTemplatePath: appRoot.resolve("config/webpack/templates"),

  // node modules
  nodeModules: appRoot.resolve("node_modules"),

  // .env example file
  envExample: appRoot.resolve(".env.example"),

  // .env file
  env: appRoot.resolve(".env"),

  // Path to fonts folder from src
  fontsPath: appRoot.resolve("src/common/fonts/"),

  // --------------------------------------------------------------------------- ATOMS

  // atoms path
  atomsPath: appRoot.resolve("src/common/atoms"),

  // atoms partial path
  atomsPartialsPath: appRoot.resolve("src/common/atoms/partials"),

  // atoms files to watch: can be glob
  atomsFilesToWatch: appRoot.resolve("src/common/atoms/partials/*.less"),

  // auto generated atoms file name
  atomsGeneratedFilename: "atoms.ts"
};
