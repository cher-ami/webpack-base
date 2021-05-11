const { Files } = require("@zouloux/files")
const logs = require("./logs-helper")
const debug = require("debug")("config:bundle-type-helper")
const config = require("../global.config")
const paths = require("../global.paths")

/**
 * Get install.config.js file
 * @description Check if the file exist, if not, the promise resolve null.
 * If file exist, return the full object write in the file.
 * @param installConfigFilePath Path to install.config.js file
 * @return {Promise<Object|null>}
 */
getInstallConfigHelper = (
  installConfigFilePath = `${paths.config}/install.config.js`
) => {
  return new Promise((resolve) => {
    debug("Check if install.config.js file exist...")

    const installConfigFile = Files.getFiles(installConfigFilePath).files
    debug("install.config.js", installConfigFile)

    if (installConfigFile.length === 0) {
      debug("install.config.js doesn't exist, aborting.")
      resolve(null)
    }

    debug("require the file...")
    const file = require(`../../config/install.config`)

    debug("Check if bundleType key exist...")
    if (file) {
      debug("Promise return install.config object:", file)
      resolve(file)
    }
  })
}

module.exports = { getInstallConfigHelper }
