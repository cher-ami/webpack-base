const { prebuildPages } = require("./modules/prepbuild-pages");
const { prebuildHtaccess } = require("./modules/prebuild-htaccess");
const { installConfigHelper } = require("../../helpers/install-config-helper");
const debug = require("debug")("config:prebuild");

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Execute all prebuild modules
 */
const prebuild = () =>
  new Promise(async resolve => {
    debug("read install.config.js file...");
    const installConfig = await installConfigHelper();

    debug("installConfig", installConfig);
    if (installConfig !== null && installConfig.bundleType === "react") {
      debug("this is a react bundleType, continue...");
      // prebuild pages
      await prebuildPages();
    } else {
      debug("install.config.js file doesn't exist, continue.");
    }

    // prebuild htaccess
    await prebuildHtaccess();

    resolve();
  });

module.exports = { prebuild };
