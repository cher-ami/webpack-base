require("colors");
const { logs } = require("../../helpers/logs-helper");
const CLI = require("@solid-js/cli");
const { clean } = require("../clean");
const { prebuild } = require("../prebuild");

/**
 * Start webpack dev server
 * @returns {Promise<void>}
 * @private
 */
const _startDevServer = async () => {
  logs.start("Start dev server");
  await CLI.execAsync(
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
  await _startDevServer();
};

module.exports = { dev };
