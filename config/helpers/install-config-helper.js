const { Files } = require("@zouloux/files");
const debug = require("debug")("config:bundle-type-helper");
const { logs } = require("./logs-helper");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// config
const config = require("../global.config");
// paths
const paths = require("../global.paths");

// ----------------------------------------------------------------------------- MODULE

/**
 * Check install.config.js file
 * Check if the file exist, if not, the promise resolve null.
 * If file exist, return the full object.
 *
 * @param installConfigFilePath Path to install.config.js file
 */
installConfigHelper = (
  installConfigFilePath = `${paths.config}/install.config.js`
) => {
  return new Promise(resolve => {
    debug("Check if install.config.js exist...");
    const installConfigFile = Files.getFiles(installConfigFilePath).files;

    debug("install.config.js", installConfigFile);

    if (installConfigFile.length === 0) {
      logs.error("install.config.js doesn't exist, aborting.");
      resolve(null);
    }

    debug("require the file...");
    const file = require(`../../config/install.config`);

    debug("Check if bundleType key exist...");
    if (file) {
      debug("Promise return install.config object:", file);
      resolve(file);
    }
  });
};

module.exports = { installConfigHelper };
