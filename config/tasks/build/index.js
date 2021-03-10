require("colors");
const { logs } = require("../../helpers/logs-helper");
const CLI = require("@solid-js/cli");
const { clean } = require("../clean");
const { prebuild } = require("../prebuild");

/**
 * Start webpack build
 * @returns {Promise<void>}
 * @private
 */
const _startBuild = async () => {
  logs.start("Start build");
  try {
    await CLI.execAsync(
      [
        `NODE_ENV=production`,
        `webpack --config config/webpack/webpack.production.js`,
      ].join(" "),
      3
    );
  } catch (e) {
    logs.error("Webpack build failed. Exit.", e);
    process.exit(1);
  }
  logs.done();
};

/**
 * build task
 * @returns {Promise<unknown>}
 */
const build = async () => {
  await clean();
  await prebuild();
  await _startBuild();
};

module.exports = { build };
