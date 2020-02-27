const { Files } = require("@zouloux/files");
const { logs } = require("../../helpers/logs-helper");
const { getBundleListHelper } = require("../../helpers/get-bundle-list-helper");
const debug = require("debug")("config:prebuild-bundle-list");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// config
const config = require("../../global.config");
// paths
const paths = require("../../global.paths");

// ----------------------------------------------------------------------------- MODULE

/**
 * Prebuild bundle list
 * @description prebuild a bundle list entry points for webpack
 */
const prebuildBundleList = async (pBundleSourceFolder = paths.src) => {
  logs.start("Prebuild bundle list...");

  // new file path
  const newFilePath = `${pBundleSourceFolder}/bundles.ts`;
  debug("newFilePath", newFilePath);

  // get bundle list
  const bundleList = await getBundleListHelper(true);
  debug("bundleList", bundleList);

  // prepare template
  const template = pBundleList => {
    return `/**
     * WARNING
     * Auto-generated file, do not edit!
     */
    module.exports = {
      ${pBundleList
        .map((el, i) => {
          return `"${el}": require("${el}/index")${
            i !== pBundleList.length - 1 ? "," : ""
          }`;
        })
        .join("\n")}
    };`.replace(/  +/g, "");
  };

  debug("template", template(bundleList));

  // write new file
  Files.new(newFilePath).write(template(bundleList));
  logs.done();
};

module.exports = { prebuildBundleList };
