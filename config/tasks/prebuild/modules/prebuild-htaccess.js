const { Files } = require("@zouloux/files");
const paths = require("../../../paths");
const webPackConfig = require("../../../webpack/config");
const {
  logStart,
  logDone,
  logError
} = require("../../../_common/helpers/logs-helper");

/**
 * Prebuild .htaccess file
 * Usefull is this file
 */
const prebuildHtaccess = () => {
  logStart("Prebuild htaccess...");
  //
  const newFilePath = `${webPackConfig.outputPath}/.htaccess`;
  // target file
  const templateFilePath =
    paths.config + "/tasks/prebuild/templates/.htaccess.template";
  // create file
  Files.new(newFilePath).write(Files.getFiles(templateFilePath).read());

  logDone({});
};

module.exports = prebuildHtaccess;
