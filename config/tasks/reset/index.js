require("colors")
const { Files } = require("@zouloux/files")
const { execAsync } = require("@solid-js/cli")
const logs = require("../../helpers/logs-helper")
const config = require("../../global.config")

/**
 * Reset task
 * @returns {Promise<unknown>}
 */
const reset = () => {
  return new Promise(async (resolve) => {
    logs.start("Clean")

    logs.start("Remove output compile folder")
    Files.any(config.outputPath).remove()
    logs.done()

    logs.start("Remove node modules")
    await execAsync("rm -rf node_modules", 3)
    logs.done()

    logs.start("Remove package-lock.json")
    await execAsync("rm -rf package-lock.json", 3)
    logs.done()

    logs.start("Re install dependencies")
    await execAsync("npm i", 3)
    logs.done()

    resolve()
  })
}

module.exports = { reset }
