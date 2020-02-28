const { prebuildReactPagesList } = require("../prebuild-react-pages-list");
const { prebuildHtaccess } = require("../prebuild-htaccess");
const { prebuildDotenv } = require("../prebuild-dotenv");
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
const prebuild = (pEnv = null) => {
  debug("pEnv", pEnv);

  return new Promise(async resolve => {
    /**
     * Do not touch.
     */
    // prebuld bundle list for webpack
    await prebuildBundleList();

    /**
     * Optional
     * These brebuild tasks can be removed and you can add your own.
     */
    // prebuild htaccess file
    await prebuildHtaccess();

    // prebuild .env file
    await prebuildDotenv();

    // get install config content file
    const getInstallConfig = await getInstallConfigHelper();
    // if extist and we are on react bundle type
    if (getInstallConfig !== null && getInstallConfig.bundleType === "react") {
      debug("this is a react bundleType, prebuild react pages list...");
      await prebuildReactPagesList();
    }

    // end
    resolve();
  });
};

module.exports = { prebuild };
