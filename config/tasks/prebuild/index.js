const { prebuildReactPagesList } = require("../prebuild-react-pages-list");
const { prebuildHtaccess } = require("../prebuild-htaccess");
const {
  getInstallConfigHelper
} = require("../../helpers/get-install-config-helper");
const { prebuildBundleList } = require("../prebuild-bundle-list/index");
const debug = require("debug")("config:prebuild");

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Execute all prebuild modules
 * @param {string|null} pEnv: current envName (staging, qa, ...), can be null
 */
const prebuild = pEnv =>
  new Promise(async resolve => {
    // prebuld bundle list for webpack
    await prebuildBundleList();
    // prebuild htaccess
    await prebuildHtaccess();
    // get install config content file
    const getInstallConfig = await getInstallConfigHelper();
    debug("getInstallConfig file", getInstallConfig);

    if (getInstallConfig !== null && getInstallConfig.bundleType === "react") {
      debug("this is a react bundleType, continue...");
      // prebuild react pages list
      await prebuildReactPagesList();
    }

    resolve();
  });

module.exports = { prebuild };
