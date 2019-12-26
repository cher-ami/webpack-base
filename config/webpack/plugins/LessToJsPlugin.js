const { prebuildAtoms } = require("../../tasks/atoms");
const { Files } = require("@zouloux/files");

// params
const PLUGIN_NAME = "less-to-js-plugin";
const log = require("debug")(`config:${PLUGIN_NAME}`);

/**
 * Less to JS Plugin
 * Allow to parse and transform Less variables to JS object.
 */
module.exports = class LessToJsPlugin {
  /**
   * Constructor
   * @param options
   */
  constructor(options) {
    //log(options);

    // files string url to watch, accept glob
    this.watcher = options.watcher;

    // output path
    this.outputPath = options.outputPath;

    // name of the output file
    this.outputFilename = options.outputFilename;
  }

  // ---------------------------–---------------------------–------------------- PRIVATE
  //
  // _filesAsChanged(pCompilation, pWatchFiles = this.watcher) {
  //   // if is glob,
  //   const glob = Files.getFiles(pWatchFiles);
  //
  //   // check if is glob (glob.files.length > 0)
  //   if (glob.files && glob.files.length > 0) {
  //     // is glob
  //     return glob.files.some(el => el === this._getChangedFiles(pCompilation));
  //   }
  // }

  /**
   * Get compilation files changes names
   * @param pCompilation
   * @private
   */
  _getChangedFiles(pCompilation) {
    // get get changed times
    const changedTimes =
      pCompilation.watchFileSystem.watcher &&
      pCompilation.watchFileSystem.watcher.mtimes;
    // get changes files
    return Object.keys(changedTimes)
      .map(file => `\n  ${file}`)
      .join("");
  }

  // ---------------------------–---------------------------–------------------- PUBLIC

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
      log(`Prebuild atoms...`);
      return await prebuildAtoms({});
    });

    /**
     * The "watchRun" hook runs only when using 'watch mode' with webpack
     * triggering every time that webpack recompiles on a change triggered by the watcher
     */
    compiler.hooks.watchRun.tapPromise(PLUGIN_NAME, async compilation => {
      // get changed files
      const changedFiles = this._getChangedFiles(compilation);
      log("changedFiles: ", changedFiles);

      // check files to watch
      const glob = Files.getFiles(this.watcher);

      let fileAsCHanged;
      // check if is glob (glob.files.length > 0)
      if (glob.files && glob.files.length > 0) {
        log("glob files", glob.files[0]);

        // is glob
        fileAsCHanged = glob.files.some(el => {
          log("el", el);
          return el === changedFiles;
        });
      }

      log("fileAsCHanged", fileAsCHanged);

      // TODO If changed files match with option params
      if (changedFiles.includes("src/atoms/partials/")) {
        // return prebuild
        log(`Prebuild atoms... `);
        return await prebuildAtoms({
          pOutputFilename: this.outputFilename
        });
      } else {
        log("Not prebluild, matches files doesn't changed");
      }
    });
  }
};
