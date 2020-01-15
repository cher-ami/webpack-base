require("colors");
const { execSync } = require("@solid-js/cli");
const prebuild = require("../prebuild/prebuild");
const {
  logStart,
  logDone,
  logError
} = require("../../_common/helpers/logs-helper");

// ----------------------------------------------------------------------------- PRIVATE

/**
 * Start webpack dev server
 * @returns {Promise<void>}
 * @private
 */
const _startDevServer = async () => {
  logStart("Start dev server", false);
  // start webpack
  await execSync(
    "cross-env webpack -p --config config/webpack/webpack.production.js",
    3
  );
  logDone({});
};

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Init Start
 * @returns {Promise<unknown>}
 */
const init = () =>
  new Promise(async resolve => {
    // start prebuid
    await prebuild();
    // start dev server
    await _startDevServer();
    // end
    resolve();
  });

module.exports = init();
