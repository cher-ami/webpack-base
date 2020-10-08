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
  await execSync(
    [
      `NODE_ENV=development`,
      `webpack-dev-server --config config/webpack/webpack.development.js`,
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
    await clean();
    await prebuild();
    await sprites();
    await _startDevServer();
    resolve();
  });

module.exports = { dev };
