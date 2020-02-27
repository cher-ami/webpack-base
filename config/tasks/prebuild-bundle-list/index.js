const { Files } = require("@zouloux/files");
const { logs } = require("../../helpers/logs-helper");
const debug = require("debug")("config:prebuild-bundle-list");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// config
const globalConfig = require("../../global.config");
// paths
const paths = require("../../global.paths");

// ----------------------------------------------------------------------------- MODULE

/**
 * Prebuild bundle list
 * @description prebuild a bundle list entry points for webpack
 */
const prebuildBundleList = () => {
  logs.start("Prebuild htaccess...");

  // new file path
  const newFilePath = `${paths.src}/.htaccess`;
  debug(newFilePath, "newFilePath");

  // file template

  // get all bundles

  Files.new(newFilePath).write(``);

  logs.done();
};

//module.exports = { prebuildBundleList };
module.exports = prebuildBundleList();
