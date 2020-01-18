const globalConfig = require("../../global.config");

module.exports = {
  /**
   * SECURITY
   * If you need to work on this task,
   * fakeMode allow to not really write/erase files.
   */
  fakeMode: globalConfig.fakeMode,

  /**
   * Show log done for x ms
   */
  logDoneDelay: globalConfig.logDoneDelay
};
