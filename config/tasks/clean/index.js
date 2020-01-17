require("colors");
const { Files } = require("@zouloux/files");
const { logs } = require("../../helpers/logs-helper");
const folderToClean = require("../../global.config").outputPath;

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Init Start
 * @returns {Promise<unknown>}
 */

const clean = () =>
  new Promise(async resolve => {
    logs.start("Clean output folder...");
    Files.any(folderToClean).remove();
    logs.done();
    resolve();
  });

module.exports = { clean };
