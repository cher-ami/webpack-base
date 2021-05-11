require("colors")
const { Files } = require("@zouloux/files")
const logs = require("../../../helpers/logs-helper")
const debug = require("debug")("config:setup-install-config")
const paths = require("../../../global.paths")
const config = require("../../../global.config")

/**
 * Init Install config file
 * This file contains installation informations
 * @returns {Promise<unknown>}
 */
const setupInstallConfig = ({
  installConfigPath = paths.installConfig,
  logDoneDelay = config.logDelay,
  fakeMode = config.fakeMode,
} = {}) => {
  debug("setupInstallConfig params:", {
    installConfigPath,
    logDoneDelay,
  })

  return new Promise(async (resolve) => {
    logs.start(`Create config file in ${installConfigPath}`)

    // init install config template
    const template = (pFileTabRegex = new RegExp(`\n(${"\t\t\t"})`, "gmi")) => {
      return `
			/**
			 * WARNING
			 * Auto-generated file, do not edit!
			 */
			module.exports = {
		  date: "${new Date()}",
			};`.replace(pFileTabRegex, "\n")
    }

    debug("This template will be print in new config file:", template())

    debug(`write ${installConfigPath} file...`)
    if (!fakeMode) {
      Files.new(installConfigPath).write(template())
    } else {
      debug("FakeMode is activated, do nothing.".red)
    }
    logs.done()
    setTimeout(resolve, logDoneDelay)
  })
}

module.exports = setupInstallConfig
