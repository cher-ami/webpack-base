const appRoot = require("app-root-path");

module.exports = {
  src: appRoot.resolve("src"),
  static: appRoot.resolve("dist/static"),
  dist: appRoot.resolve("dist"),
  nodeModules: appRoot.resolve("node_modules"),
  env: appRoot.resolve(".env")
};
