const { Files } = require("@zouloux/files");
const paths = require("../../../global.paths");
const { logs } = require("../../../helpers/logs-helper");
const webPackConfig = require("../../../global.config");

/**
 * Prebuild .htaccess file
 * Usefull is this file
 */
const prebuildHtaccess = () => {
  logs.start("Prebuild htaccess...");
  //
  const newFilePath = `${webPackConfig.outputPath}/.htaccess`;
  // target file
  const templateFilePath =
    paths.config + "/tasks/prebuild/templates/.htaccess.template";
  // create file
  Files.new(newFilePath).write(Files.getFiles(templateFilePath).read());

  logs.done();
};

module.exports = prebuildHtaccess;
