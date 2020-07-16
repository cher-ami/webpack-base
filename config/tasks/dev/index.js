require("colors");
const { logs } = require("../../helpers/logs-helper");
const { execSync } = require("@solid-js/cli");
const { clean } = require("../clean");
const { prebuild } = require("../prebuild");
const { sprites } = require("../sprites");

// ----------------------------------------------------------------------------- PRIVATE

/**
 * Start webpack dev server
 * @returns {Promise<void>}
 * @private
 */
const _startDevServer = async () => {
  logs.start("Start dev server");
  // start webpack
  await execSync(
    [
      // this value will never change
      `NODE_ENV=development`,
      // target .env, this value will never change
      `env-cmd -f .env`,
      // start webpack devServer
      ` webpack-dev-server --config config/webpack/webpack.development.js`,
    ].join(" "),
    3
  );
};

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Init Start
 * @returns {Promise<unknown>}
 */
const dev = () =>
  new Promise(async (resolve) => {
    // clean folder
    await clean();
    // start prebuid
    await prebuild();
    // compile sprites
    await sprites();
    // start dev server
    await _startDevServer();
    // end
    resolve();
  });

module.exports = { dev };
