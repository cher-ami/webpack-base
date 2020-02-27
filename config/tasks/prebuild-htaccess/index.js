const { Files } = require("@zouloux/files");
const { logs } = require("../../helpers/logs-helper");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// config
const globalConfig = require("../../global.config");
// paths
const paths = require("../../global.paths");

// ----------------------------------------------------------------------------- MODULE

/**
 * Prebuild .htaccess file
 * Usefull is this file
 */
const prebuildHtaccess = () => {
  logs.start("Prebuild htaccess...");
  //
  const newFilePath = `${globalConfig.outputPath}/.htaccess`;
  // target file
  const templateFilePath =
    paths.config + "/tasks/prebuild/templates/.htaccess.template";
  // create file
  Files.new(newFilePath).write(Files.getFiles(templateFilePath).read());

  logs.done();
};

module.exports = { prebuildHtaccess };
