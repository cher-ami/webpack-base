require("colors");
const { Files } = require("@zouloux/files");
const { logs } = require("../../../helpers/logs-helper");
const debug = require("debug")("config:setup-install-config");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// target local path files
const paths = require("../paths");
// get local task config
const config = require("../config");

// ----------------------------------------------------------------------------- MODULE

/**
 * Init Install config
 * @returns {Promise<unknown>}
 */
const setupInstallConfig = ({
  bundleType,
  installConfigPath = paths.installConfig,
  logDoneDelay = config.logDoneDelay,
  fakeMode = config.fakeMode
}) => {
  debug("setupInstallConfig params:", {
    bundleType,
    installConfigPath,
    logDoneDelay
  });

  return new Promise(async resolve => {
    logs.start(`Create config file in ${installConfigPath}...`);

    // init install config template
    const template = (pFileTabRegex = new RegExp(`\n(${"\t\t\t"})`, "gmi")) => {
      return `
			/**
			 * WARNING
			 * Auto-generated file, do not edit!
			 */
			exports.module = {
		  date: "${new Date()}",
      bundleType: "${bundleType}",
			};`.replace(pFileTabRegex, "\n");
    };

    debug("This template will be print in new config file:", template());

    debug(`write ${installConfigPath} file...`);
    if (!fakeMode) {
      Files.new(installConfigPath).write(template());
    } else {
      debug("FakeMode is activated, do nothing.".red);
    }
    logs.done();
    setTimeout(resolve, logDoneDelay);
  });
};

module.exports = { setupInstallConfig };
