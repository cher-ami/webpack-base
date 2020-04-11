const { Files } = require("@zouloux/files");
const { logs } = require("./logs-helper");
const debug = require("debug")("config:get-bundle-list-helper");
const path = require("path");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// config
const config = require("../global.config");
// paths
const paths = require("../global.paths");

// ----------------------------------------------------------------------------- MODULE

/**
 * get Bundle List Helper
 * @return {Promise<array|null>} List of available bundles in src folder
 */
getBundleListHelper = (
  pExcludeCommonFolder = true,
  pBundleSourceFolder = paths.src
) => {
  return new Promise((resolve) => {
    // get all bundles
    let getBundleFolderList = Files.getFolders(`${pBundleSourceFolder}/*`)
      .files;

    let bundleFolderList = getBundleFolderList;

    if (pExcludeCommonFolder) {
      // remove common from bundle list
      bundleFolderList =
        // in bundle list folder
        getBundleFolderList
          // do not keep common folder
          .filter((el) => el !== `${paths.src}/common`)
          // keep only path end
          .map((el) => path.basename(el));
    }

    // resolve promise
    resolve(bundleFolderList);
  });
};

module.exports = { getBundleListHelper };
