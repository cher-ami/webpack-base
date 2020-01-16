require("colors");
const { Files } = require("@zouloux/files");
const { logs } = require("../../_common/helpers/logs-helper");
const folderToClean = require("../../webpack/config").outputPath;

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
