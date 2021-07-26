const { Files } = require("@zouloux/files")
const debug = require("debug")("config:prebuild-dotenv")

const logs = require("../../../helpers/logs-helper")
const root = require("app-root-path")

const config = require("../../../global.config")
const NEW_DOTENV_FILE_PATH = `${config.envPath}/.env`
const ALL_AVAILABLE_DOTENV = root.resolve(".env*")
const PACKAGE_JSON_VERSION = require(root.resolve("package.json")).version

/**
 * Prebuild .env file
 * Create and inject .env file in specific folder
 */
const prebuildDotEnv = (newFilePath = NEW_DOTENV_FILE_PATH) => {
  return new Promise((resolve) => {
    // read all .env files and get all var names
    const envFiles = Files.getFiles(ALL_AVAILABLE_DOTENV).files
    debug("available env files", envFiles)

    // get vars from all .env files and add them to the same array
    const vars = envFiles
      .map((el) =>
        // read current .env file
        Files.getFiles(el)
          .read()
          // split each lines
          .split("\n")
          // for each line, filter comments and keep only var name
          .map((el) => {
            const isComment = el.includes("#")
            const containsEqual = el.includes("=")
            if (!isComment && containsEqual) {
              const varName = el.split("=")[0]
              return varName ? varName : null
            }
          })
          // remove empty lines
          .filter((e) => e)
      )
      // flat arrays results
      .flat()

      // remove double entries
      .filter((elem, index, self) => index === self.indexOf(elem))
    debug("available vars after merge vars from all .env files", vars)

    let template
    // create template with varNames and process.env values
    template = vars.map((el) => `${el}=${process.env[el] || ""}`)

    // push current version in it
    template.push(`VERSION=${PACKAGE_JSON_VERSION}`)
    debug("template", template)

    // filter to remove empty lines
    template = template.filter((e) => e).join("\n")
    debug("template to write in file", template)

    logs.start("Prebuild dotenv")
    logs.note(`dotenv path: ${newFilePath}`)

    debug("write .env file...")
    Files.new(newFilePath).write(template)

    logs.done()
    resolve()
  })
}

module.exports = prebuildDotEnv
