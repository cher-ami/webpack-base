const appRoot = require("app-root-path");

module.exports = {
  // root folder
  root: appRoot.resolve(""),

  // src folder
  src: appRoot.resolve("src"),

  // dist folder
  dist: appRoot.resolve("dist"),

  // static folder
  static: appRoot.resolve("dist/static"),

  // node modules
  nodeModules: appRoot.resolve("node_modules"),

  // .env example file
  envExample: appRoot.resolve(".env.example"),

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
  outputSpritesFolder: "src/sprites/",

  // --------------------------------------------------------------------------- ATOMS

  // atoms path
  atomsPath: appRoot.resolve("src/atoms"),

  // atoms partial path
  atomsPartialsPath: appRoot.resolve("src/atoms/partials"),

  // atoms files to watch: can be glob
  atomsFilesToWatch: appRoot.resolve("src/atoms/partials/*.less"),

  // auto generated atoms file name
  atomsGeneratedFilename: "atoms.ts"
};
