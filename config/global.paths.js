const appRoot = require("app-root-path");

module.exports = {
  // root folder
  root: appRoot.resolve(""),

  // --------------------------------------------------------------------------- SRC

  // src folder
  src: appRoot.resolve("src"),

  common: appRoot.resolve("src/common"),

  // Path to fonts folder from src
  fontsPath: appRoot.resolve("src/common/fonts/"),

  // --------------------------------------------------------------------------- ATOMS

  /**
   * These are used by custom less-to-js-webpack-plugin
   */

  // atoms path
  atomsPath: appRoot.resolve("src/common/atoms"),

  // atoms partial path
  atomsPartialsPath: appRoot.resolve("src/common/atoms/partials"),

  // atoms files to watch: can be glob
  atomsFilesToWatch: appRoot.resolve("src/common/atoms/partials/*.less"),

  // auto generated atoms file name
  atomsGeneratedFilename: "atoms.ts",

  // --------------------------------------------------------------------------- DIST

  // dist folder
  dist: appRoot.resolve("dist"),

  // static folder
  static: appRoot.resolve("dist/static"),

  // --------------------------------------------------------------------------- CONFIG

  // config folder
  config: appRoot.resolve("config"),

  // tasks
  tasks: appRoot.resolve("config/tasks"),

  // webpack template - move ?
  webpackTemplatePath: appRoot.resolve("config/webpack/templates"),

  // node modules
  nodeModules: appRoot.resolve("node_modules"),

  // .env example file
  envExample: appRoot.resolve(".env.example"),

  // .env file
  env: appRoot.resolve(".env")
};
