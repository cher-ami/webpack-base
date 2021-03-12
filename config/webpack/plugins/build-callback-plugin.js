const PLUGIN_NAME = "print-dev-server-plugin";
const debug = require("debug")(`config:${PLUGIN_NAME}`);

const { devTaskPromise } = require("../../tasks/dev");

module.exports = class BuildCallbackPlugin {
  constructor({ watchRunCallback = () => {} }) {
    this.watchRunCallback = watchRunCallback;
  }

  apply(compiler) {
    /**
     * The "watchRun" hook runs only when using 'watch mode' with webpack
     * triggering every time that webpack recompiles on a change triggered by the watcher
     */

    compiler.hooks.watchRun.tap(PLUGIN_NAME, (compilation) => {
      // console.log(">>>>> hooks.done".green);
      // this.watchRunCallback(compilation);

      // compilation.hooks.finishModules.tap(PLUGIN_NAME, (compilation) => {
      // devTaskPromise.resolve();

//      });

//       compilation.hooks.invalid.tap(PLUGIN_NAME, () => {
//         console.log(">>>>> hooks.invalid".red);
// //        this.watchRunCallback(compilation);
//       //  devTaskPromise.reject();
//       });

    });

  }
};
