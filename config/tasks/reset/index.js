require("colors");
const { Files } = require("@zouloux/files");
const { execSync } = require("@solid-js/cli");
const { logStart, logDone } = require("../../_common/helpers/logs-helper");

// folder to clean
const folderToClean = require("../../webpack/config").outputPath;

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Init Start
 * @returns {Promise<unknown>}
 */
const reset = () =>
  new Promise(async resolve => {
    logStart("Clean...");

    logStart("Remove output compile folder...");
    Files.any(folderToClean).remove();
    logDone({});

    logStart("Remove node modules...");
    execSync("rm -rf node_modules", 3);
    logDone({});

    logStart("Re install dependencies...");
    execSync("npm i", 3);

    logDone({});
    resolve();
  });

module.exports = { reset };
