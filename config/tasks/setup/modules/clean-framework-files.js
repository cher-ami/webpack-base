require("colors");
const { logs } = require("../../../helpers/logs-helper");
const { execSync } = require("@solid-js/cli");
const debug = require("debug")("config:clean-framework-files");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// target local path files
const paths = require("../../../global.paths");
// get local task config
const config = require("../../../global.config");

// ----------------------------------------------------------------------------- MODULE

/**
 * cleanFrameworkFiles
 * @description
 */
const cleanFrameworkFiles = ({
  gitFolder = paths.gitFolder,
  installScriptFile = paths.installScript,
  logDoneDelay = config.logDoneDelay,
  fakeMode = config.fakeMode,
} = {}) => {
  debug("cleanFrameworkFiles params:", {
    gitFolder,
    installScriptFile,
    logDoneDelay,
  });

  return new Promise(async (resolve) => {
    debug(
      "We don't need git folder because this is .git of webpack-base, so we remove it."
    );
    logs.start("Remove .git folder... ");
    if (!fakeMode) {
      await execSync(`rm -rf ${gitFolder}`, 3);
    } else {
      debug("FakeMode is activated, do nothing.".red);
    }
    logs.done();
    setTimeout(resolve, logDoneDelay);

    logs.start("Remove install.sh file... ");
    if (!fakeMode) {
      await execSync(`rm -rf ${installScriptFile}`, 3);
    } else {
      debug("FakeMode is activated, do nothing.".red);
    }
    logs.done();
    setTimeout(resolve, logDoneDelay);
  });
};

module.exports = { cleanFrameworkFiles };
