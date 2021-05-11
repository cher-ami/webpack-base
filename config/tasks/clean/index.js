require("colors")
const { Files } = require("@zouloux/files")
const logs = require("../../helpers/logs-helper")

/**
 * Clean task
 * Will remove output folder
 */
const folderToClean = require("../../global.config").outputPath

const clean = () => {
  logs.start("Clean output folder")
  logs.note(`Folder cleaned is: ${folderToClean}`)
  Files.any(folderToClean).remove()
  logs.done()
}

module.exports = { clean }
