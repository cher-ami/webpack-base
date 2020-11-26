require("colors");
const { logs } = require("../../helpers/logs-helper");
const { execSync } = require("@solid-js/cli");
const { clean } = require("../clean");
const { prebuild } = require("../prebuild");
const { sprites } = require("../sprites");

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
      `webpack serve --config config/webpack/webpack.development.js`,
    ].join(" "),
    3
  );
};

/**
 * Init Start
 * @returns {Promise<unknown>}
 */
const dev = async () => {
  await clean();
  await prebuild();
  await sprites();
  await _startDevServer();
};

module.exports = { dev };
