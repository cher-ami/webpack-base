require("colors");
const { Files } = require("@zouloux/files");
const { logStart, logDone } = require("../../_common/helpers/logs-helper");

const folderToClean = require("../../webpack/config").outputPath;

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Init Start
 * @returns {Promise<unknown>}
 */
const init = () =>
  new Promise(async resolve => {
    logStart("Clean...");

    logStart("Remove output compile folder...");
    Files.any(folderToClean).remove();
    logDone({});

    resolve();
  });

module.exports = init();
