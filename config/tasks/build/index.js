require("colors");
const { logs } = require("../../helpers/logs-helper");
const { execSync } = require("@solid-js/cli");
const { clean } = require("../clean");
const { prebuild } = require("../prebuild");
const { sprites } = require("../sprites");
const debug = require("debug")("config:build");

// ----------------------------------------------------------------------------- PRIVATE

/**
 * Start webpack build
 * @returns {Promise<void>}
 * @private
 */
const _build = async () => {
  logs.start("Start build.");

  try {
    await execSync(
      [
        `NODE_ENV=production`,
        `webpack -p --config config/webpack/webpack.production.js`,
      ].join(" "),
      3
    );
  } catch (e) {
    logs.error("Webpack build failed. Exit.", e);
    process.exit(1);
  }

  logs.done();
};

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Init Start
 * @returns {Promise<unknown>}
 */
const build = () => {
  return new Promise(async (resolve) => {
    /**
     * Before build
     */
    await clean();
    await prebuild();
    await sprites();

    /**
     * Build
     */
    await _build();
    resolve();
  });
};

module.exports = { build };
