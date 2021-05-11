require("colors")
const { Files } = require("@zouloux/files")
const { execSync } = require("@solid-js/cli")
const debug = require("debug")("config:check-config-file")
const logs = require("../../../helpers/logs-helper")
const paths = require("../../../global.paths")
const config = require("../../../global.config")

/**
 * Check if install file cache exist
 * @returns boolean
 */
const checkConfigFile = ({ configFilePath = paths.installConfig } = {}) => {
  // check if config file exist
  if (Files.getFiles(configFilePath).files.length > 0) {
    execSync("clear", 3)
    debug(`${configFilePath} exist, error message and return false.`)
    logs.error("install.config.js already file exist, Aborting.")
    console.log(`If you want to setup this project again like the first time you installed webpack-base, you need to: \n
  - remove ${configFilePath} file
  - npm run setup
  \n
  ${"WARNING!".red.bold}\n
  ${"npm run setup".bold} erase a part of source project:\n
  - setup package.json: erase name, description, author & version keys
  - ${".git will be removed!".bold}    
      `)
    return false
  } else {
    debug(`${configFilePath} doesn't exist, continue`)
    return true
  }
}

module.exports = checkConfigFile
