require("colors");
const { Files } = require("@zouloux/files");
const { execSync } = require("@solid-js/cli");
const { logs } = require("../../helpers/logs-helper");
const paths = require("../../global.paths");
const config = require("../../global.config");

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

    logs.start("Re install dependencies.");
    execSync("npm i", 3);

    logs.done();
    resolve();
  });

module.exports = { reset };
