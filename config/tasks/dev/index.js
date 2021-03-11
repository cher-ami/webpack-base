require("colors");
const logs = require("../../helpers/logs-helper");
const { execAsync } = require("@solid-js/cli");
const { clean } = require("../clean");
const { prebuild } = require("../prebuild");

/**
 * Start webpack dev server
 * @returns {Promise<void>}
 * @private
 */

let watching;
const _startDevServer = async (exitAfterFirstCompile = false) => {
  await execAsync(
    [
      `NODE_ENV=development`,
      `webpack serve --config config/webpack/webpack.development.js`,
    ].join(" "),
    3
  );

  // const webpack = require('webpack');
  // const devConfig = require('../../webpack/webpack.development');
  // const compiler = webpack(devConfig);

  // return new Promise((resolve, reject) => {
  //
  //   logs.start('Start dev server');
  //   watching = compiler.watch({
  //     aggregateTimeout: 300,
  //     poll: undefined,
  //     open: true,
  //   }, (err, stats) => {
  //
  //     // if compiler error (err), or build error
  //     if (err || stats.hasErrors()) {
  //       logs.error('webpack build with error');
  //       reject(err);
  //     }
  //
  //     const log = stats.toString({
  //       preset: 'minimal',
  //       errors: true,
  //       warnings: true,
  //       colors: true,
  //     });
  //
  //     console.log(log);
  //     resolve(true);
  //
  //   });
  //
  //   if (exitAfterFirstCompile) {
  //     watching.close(() => {
  //       console.log('Watching Ended.');
  //     });
  //   }
  //
  // });
};

/**
 * Init Start
 * @returns {Promise<void>}
 */
const dev = async (exitAfterFirstCompile = false) => {
  clean();
  try {
    await prebuild();
    return await _startDevServer(exitAfterFirstCompile);
  } catch (e) {
    throw new Error("dev task failed");
  }
};

module.exports = { dev };
