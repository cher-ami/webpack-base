const PLUGIN_NAME = "print-dev-server-plugin";
const debug = require("debug")(`config:${PLUGIN_NAME}`);

module.exports = class BuildCallbackPlugin {
  constructor({ callback = (e) => {}, clearBetweenBuild = false }) {
    this.callback = callback;
    this.clearBetweenBuild = clearBetweenBuild;
  }

  /**
   * Apply
   */
  apply(compiler) {
    /**
     * The "beforeRun" hook runs only on single webpack build, triggering only once
     * (only for production build, not dev server)
     */
    compiler.hooks.beforeRun.tapPromise(PLUGIN_NAME, async (compilation) => {
      if (this.clearBetweenBuild) console.clear();
      this.callback(compilation);
    });
    /**
     * The "watchRun" hook runs only when using 'watch mode' with webpack
     * triggering every time that webpack recompiles on a change triggered by the watcher
     */

    compiler.hooks.watchRun.tapAsync(PLUGIN_NAME, async (compilation) => {
      if (this.clearBetweenBuild) console.clear();
      this.callback(compilation);
    });
  }
};
