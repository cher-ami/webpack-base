require("colors");
const { Files } = require("@zouloux/files");
const { logs } = require("../../../helpers/logs-helper");
const debug = require("debug")("config:setup-env-file");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// target local path files
const paths = require("../paths");
// get local task config
const config = require("../config");

// ----------------------------------------------------------------------------- MODULE

/**
 * Setup env file
 * @description allow to create .env file from .env.example file
 */
const setupEnvFile = ({
  envPath = paths.env,
  envExamplePath = paths.envExample,
  logDoneDelay = config.logDoneDelay,
  fakeMode = config.fakeMode
}) => {
  debug("setupEnvFile params", {
    envPath,
    envExamplePath,
    logDoneDelay
  });

  return new Promise(async resolve => {
    logs.start("Setup .env file...");

    // check
    if (Files.getFiles(envPath).files.length > 0) {
      logs.error(".env file already exists. Aborting.");
      setTimeout(resolve, logDoneDelay);
      return;
    }

    if (!fakeMode) {
      logs.note("Create new .env file from .env.example template...");
      Files.new(envPath).write(Files.getFiles(envExamplePath).read());
    } else {
      debug("FakeMode is activated, do nothing.".red);
    }

    logs.done();
    setTimeout(resolve, logDoneDelay);
  });
};

module.exports = { setupEnvFile };
