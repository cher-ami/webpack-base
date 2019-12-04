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

  // Path to fonts folder from src
  fontsPath: appRoot.resolve("src/fonts/"),

  // Skeletons path
  skeletonsPath: appRoot.resolve("config/skeletons"),

  // Sprite path
  spritesPath: appRoot.resolve("src/sprites"),

  // Sprite folder
  spritesFolder: "sprites/",

  // Sprite PNG output
  outputSpritesFolder: "src/sprites/"
};
