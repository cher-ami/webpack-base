const { prebuildAtoms } = require("./prebuild-atoms")
const { Files } = require("@zouloux/files")
const PLUGIN_NAME = "less-to-js-webpack-plugin"
const debug = require("debug")(`config:${PLUGIN_NAME}`)

/**
 * Less to JS Plugin
 * Allow to parse and transform Less variables to JS object.
 */
module.exports = class LessToJsPlugin {
  /**
   * Constructor
   * @param watcher: files string url to watch, accept glob
   * @param outputPath: output path
   * @param outputFilename: name of the output file
   */
  constructor({ watcher = "", outputPath = "", outputFilename = "" }) {
    this.watcher = watcher
    this.outputPath = outputPath
    this.outputFilename = outputFilename
  }

  /**
   * Get compilation files changes names
   * @param compilation
   * @returns {[]}
   * @private
   */
  _getChangedFiles(compilation) {
    return compilation.modifiedFiles ? Array.from(compilation.modifiedFiles) : []
  }

  /**
   * Check if a file of glob list as changed
   * @param compilation
   * @returns {boolean}
   * @private
   */
  _fileAsChanged(compilation) {
    // check files to watch
    const glob = Files.getFiles(this.watcher)
    debug("glob.files", glob.files)

    const changedFiles = this._getChangedFiles(compilation)
    debug("changedFiles", changedFiles)

    // check if is glob (glob.files.length > 0)
    if (glob.files && glob.files.length > 0) {
      // register file as change boolean
      return glob.files.some((globEl) =>
        // check if a file of change file list match with one of glob files
        changedFiles.some((changeEl) => globEl.includes(changeEl))
      )
    } else return false
  }

  /**
   * Check if output file exist
   * @returns {boolean}
   * @private
   */
  _outputFileExist() {
    return Files.getFiles(`${this.outputPath}/${this.outputFilename}`).files.length > 0
  }

  /**
   * Build less to js file
   * Parse & Building process are external tasks in order to call these outside
   * this webpack plugin
   * @returns {*|Promise<unknown>}
   * @private
   */
  _buildLessToJsFile() {
    return prebuildAtoms({
      pWatcher: this.watcher,
      pOutputPath: this.outputPath,
      pOutputFilename: this.outputFilename,
    })
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
    compiler.hooks.beforeRun.tapPromise(PLUGIN_NAME, async (compilation) => {
      debug(`Prebuild less to js file...`)
      return await this._buildLessToJsFile()
    })

    /**
     * The "watchRun" hook runs only when using 'watch mode' with webpack
     * triggering every time that webpack recompiles on a change triggered by the watcher
     */
    compiler.hooks.watchRun.tapPromise(PLUGIN_NAME, async (compilation) => {
      const outputFileExist = this._outputFileExist()
      const fileAsChanged = this._fileAsChanged(compilation)
      debug({ outputFileExist, fileAsChanged }, !outputFileExist || fileAsChanged)

      // if output file don't exist
      // or files to watch were changed
      if (!outputFileExist || fileAsChanged) {
        debug(`Prebuild less to js file...`)
        await this._buildLessToJsFile()
      } else {
        debug("Prebluild nothing, matches files doesn't changed")
      }
    })
  }
}
