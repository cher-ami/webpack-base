const { logs } = require("../../../helpers/logs-helper");
const { scaffoldBundle } = require("../../scaffold-bundle");
const paths = require("../../../global.paths");
const config = require("../../../global.config");
const debug = require("debug")("config:setup-bundle");

/**
 * Setup Bundle
 * @returns {Promise<unknown>}
 */
const setupBundle = async ({
  logDoneDelay = config.logDoneDelay,
  scaffoldBundleFunction = scaffoldBundle,
}) => {
  return new Promise(async (resolve) => {
    logs.start("Setup bundle project type...");
    const bundleType = await scaffoldBundleFunction(true);
    logs.done();
    setTimeout(() => resolve(bundleType), logDoneDelay);
  });
};

module.exports = { setupBundle };
