/**
 * Less to JS Plugin
 * Allow to parse and transform Less variables to JS object.
 */

// get prebuild atoms task
const { prebuildAtoms } = require("../../tasks/atoms");
const PLUGIN_NAME = "less-to-js-plugin";
const debug = require("debug")(`config:${PLUGIN_NAME}`);

/**
 * LessToJsPlugin
 */
module.exports = class LessToJsPlugin {
  /**
   * Constructor
   * @param options
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * Get compilation files changes names
   * @param pCompilation
   * @param pLog
   * @private
   */
  _getChangedFiles(pCompilation, pLog = true) {
    // get get changed times
    const changedTimes = pCompilation.watchFileSystem.watcher.mtimes;
    // get changes files
    return Object.keys(changedTimes)
      .map(file => `\n  ${file}`)
      .join("");
  }
  /**
   * Apply
   * @param compiler
   */
  apply(compiler) {
    /**
     * The "beforeRun" hook runs only on single webpack build, triggering only once
     * (only for production build, not dev server)
     */
    compiler.hooks.beforeRun.tapAsync(PLUGIN_NAME, async compilation => {
      debug(`Prebuild atoms...`);
      //return new Promise(resolve => preBuildAtoms(resolve));
    });

    /**
     * The "watchRun" hook runs only when using 'watch mode' with webpack
     * triggering every time that webpack recompiles on a change triggered by the watcher
     */
    compiler.hooks.watchRun.tapPromise(PLUGIN_NAME, async compilation => {
      // get changed files
      const changedFiles = this._getChangedFiles(compilation);

      // TODO If changed files match with option params
      if (changedFiles.includes("src/atoms/partials/")) {
        // prebuild atoms and resolve promise
        debug(`Prebuild atoms... `);
        debug(`Changed files: ${changedFiles}`);

        // return prebuild
        return await prebuildAtoms();
      } else {
        debug("Not prebluild, matches files doesn't changed");
      }
    });
  }
};
