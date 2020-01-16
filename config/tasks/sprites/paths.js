const appRoot = require("app-root-path");
const paths = require("../../global.paths");

module.exports = {
  // bundle path
  bundlePath: paths.src,

  // Templates path
  templatesPath: appRoot.resolve("config/tasks/sprites/templates"),

  // Sprite path
  spritesPath: appRoot.resolve("src/common/sprites"),

  // Sprite folder
  spritesFolder: "sprites/",

  // Sprite PNG output
  outputSpritesFolder: "src/common/sprites/"
};
