/**
 * Less to JS Plugin
 * Allow to parse and transform Less variables to JS object.
 * @type {lessToJsPlugin}
 */

//
// get prebuild atoms task
const preBuildAtoms = require("../../tasks/atoms");

module.exports = class lessToJsPlugin {
  /**
   * Get options
   * @param options
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * Apply
   * @param compiler
   */
  apply(compiler) {
    // after each compile
    compiler.hooks.beforeCompile.tap("BundleSizePlugin", states => {
      console.log("---------- FROM lessToJsPlugin");
      // prebuild atoms
      preBuildAtoms();
    });
  }
};
