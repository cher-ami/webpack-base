const { logs } = require("../../../helpers/logs-helper");
const { help } = require("../../help");
const debug = require("debug")("config:show-help");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// target local path files
const paths = require("../../../global.paths");
// get local task config
const config = require("../../../global.config");

// ----------------------------------------------------------------------------- MODULE

/**
 * Show help
 */
const showHelp = () => {
  return new Promise(async (resolve) => {
    logs.start("Show help...");
    logs.note("npm run help");
    help();
    resolve();
  });
};

module.exports = { showHelp };
