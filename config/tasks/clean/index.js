require("colors");
const { Files } = require("@zouloux/files");
const { logs } = require("../../helpers/logs-helper");

// ----------------------------------------------------------------------------- PUBLIC

const folderToClean = require("../../global.config").outputPath;

/**
 * Init Start
 * @returns {Promise<unknown>}
 */

const clean = () =>
  new Promise(async (resolve) => {
    logs.start("Clean output folder");
    logs.note(`Folder cleaned is: ${folderToClean}`);
    Files.any(folderToClean).remove();
    logs.done();
    resolve();
  });

module.exports = { clean };
