const { prebuildHtaccess } = require("../prebuild-htaccess");
const { prebuildDotEnv } = require("../prebuild-dotenv");
const debug = require("debug")("config:prebuild");

// ----------------------------------------------------------------------------- PATHS / CONFIG

const config = require("../../global.config");
const paths = require("../../global.paths");

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Execute all prebuild modules
 */
const prebuild = () => {
  return new Promise(async (resolve) => {
    if (process.env.PREBUILD_HTACCESS === "true") await prebuildHtaccess();
    if (process.env.PREBUILD_DOTENV === "true") await prebuildDotEnv();
    resolve();
  });
};

module.exports = { prebuild };
