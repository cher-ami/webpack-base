require("colors")
const logs = require("../../../helpers/logs-helper")
const { Files } = require("@zouloux/files")
const debug = require("debug")("config:scaffold-postType")

//Components builders
const buildPostType = require("./builders/post-type")
const buildPage = require("./builders/page")
const buildOptionPage = require("./builders/option-page")
const buildBlock = require("./builders/block")

// remove Files lib logs
Files.setVerbose(false)

// get local task path
const paths = require("../../../global.paths")

// ----------------------–----------------------–----------------------–-------- PUBLIC

/**
 * @name index
 * @description Ask question and scaffold a postType with a specific script template
 * @param <string> type  type of component to build
 * @returns {Promise<any>}
 */
const wpScaffoldComponent = (type) => {
  return new Promise(async (resolve) => {
    // prepare

    switch (type) {
      case "postType":
        await buildPostType()
        break

      case "page":
        await buildPage()
        break

      case "block":
        await buildBlock()
        break

      case "optionPage":
        await buildOptionPage()
        break

      default:
        logs.error("No choice done... exiting")
        break
    }

    resolve()
  })
}

/**
 * return scaffold postType function
 */
module.exports = wpScaffoldComponent
