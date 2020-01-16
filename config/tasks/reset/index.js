require("colors");
const { Files } = require("@zouloux/files");
const { execSync } = require("@solid-js/cli");
const { logs } = require("../../_common/helpers/logs-helper");

// folder to clean
const folderToClean = require("../../global.config").outputPath;

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Init Start
 * @returns {Promise<unknown>}
 */
const reset = () =>
  new Promise(async resolve => {
    logs.start("Clean...");

    logs.start("Remove output compile folder...");
    Files.any(folderToClean).remove();
    logs.done();

    logs.start("Remove node modules...");
    execSync("rm -rf node_modules", 3);
    logs.done();

    logs.start("Re install dependencies...");
    execSync("npm i", 3);

    logs.done();
    resolve();
  });

module.exports = { reset };
