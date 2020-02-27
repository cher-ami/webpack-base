const { prebuildPages } = require("./modules/prebuild-pages");
const { prebuildHtaccess } = require("./modules/prebuild-htaccess");
const {
  getInstallConfigHelper
} = require("../../helpers/get-install-config-helper");
const { prebuildBundleList } = require("../prebuild-bundle-list/index");
const debug = require("debug")("config:prebuild");

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Execute all prebuild modules
 */
const prebuild = () =>
  new Promise(async resolve => {
    debug("read install.config.js content file...");

    // get install config content file
    const getInstallConfig = await getInstallConfigHelper();

    debug("getInstallConfig file", getInstallConfig);
    if (getInstallConfig !== null && getInstallConfig.bundleType === "react") {
      debug("this is a react bundleType, continue...");
      // prebuild pages
      await prebuildPages();
    } else {
      debug("install.config.js file doesn't exist, continue.");
    }

    // prebuld bundle list for webpack
    await prebuildBundleList();

    // prebuild htaccess
    await prebuildHtaccess();

    resolve();
  });

module.exports = { prebuild };
