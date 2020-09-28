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
        // this value will never change
        `NODE_ENV=production`,
        // webpack build
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
const build = (pVar) => {
  // target env variable
  const envName = pVar.env ? pVar.env : null;
  debug("env passed as param via 'commands' ", envName);

  return new Promise(async (resolve) => {
    /**
     * Before build
     */
    // clean folder
    await clean();
    // start prebuid
    await prebuild(envName);
    // compile sprites
    await sprites();

    /**
     * Build
     */
    // start dev server
    await _build();
    // end
    resolve();
  });
};

module.exports = { build };
