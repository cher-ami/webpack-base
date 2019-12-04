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
  env: appRoot.resolve(".env")
};
