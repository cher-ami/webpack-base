require("colors");
const { Files } = require("@zouloux/files");
const { execSync } = require("@solid-js/cli");
const { logs } = require("../../helpers/logs-helper");
const config = require("../../global.config");
const paths = require("../../global.paths");

/**
 * Reset task
 * @returns {Promise<unknown>}
 */
const reset = () =>
  new Promise(async (resolve) => {
    logs.start("Clean.");

    logs.start("Remove output compile folder.");
    Files.any(config.outputPath).remove();
    logs.done();

    logs.start("Remove node modules.");
    execSync("rm -rf node_modules", 3);
    logs.done();

    logs.start("Remove package-lock.json.");
    execSync("rm -rf package-lock.json", 3);
    logs.done();

    logs.start("Re install dependencies.");
    execSync("npm i", 3);

    logs.done();
    resolve();
  });

module.exports = { reset };
