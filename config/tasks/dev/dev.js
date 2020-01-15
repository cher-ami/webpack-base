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
  logStart("Start dev server...");
  // start webpack
  await execSync(
    "cross-env env-cmd -f .env webpack-dev-server --config config/webpack/webpack.development.js",
    3
  );
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
