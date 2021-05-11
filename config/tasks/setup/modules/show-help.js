const logs = require("../../../helpers/logs-helper")
const { help } = require("../../help")
const debug = require("debug")("config:show-help")
const paths = require("../../../global.paths")
const config = require("../../../global.config")

/**
 * Show help
 */
const showHelp = () => {
  return new Promise(async (resolve) => {
    logs.start("Show help")
    logs.note("npm run help")
    help()
    resolve()
  })
}

module.exports = showHelp
