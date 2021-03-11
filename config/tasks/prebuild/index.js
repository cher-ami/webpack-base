const prebuildHtaccess = require("../prebuild-htaccess");
const prebuildDotEnv = require("../prebuild-dotenv");
const debug = require("debug")("config:prebuild");

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
