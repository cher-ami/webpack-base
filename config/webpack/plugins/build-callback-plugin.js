const PLUGIN_NAME = "print-dev-server-plugin";
const debug = require("debug")(`config:${PLUGIN_NAME}`);

module.exports = class BuildCallbackPlugin {
  constructor({ callback = (e) => {} }) {
    this.callback = callback;
  }

  apply(compiler) {
    /**
     * The "watchRun" hook runs only when using 'watch mode' with webpack
     * triggering every time that webpack recompiles on a change triggered by the watcher
     */
    compiler.hooks.watchRun.tap(PLUGIN_NAME, (compilation) => {
      this.callback(compilation);
    });
  }
};
