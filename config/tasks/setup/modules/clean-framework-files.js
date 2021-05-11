require("colors")
const logs = require("../../../helpers/logs-helper")
const { execSync } = require("@solid-js/cli")
const debug = require("debug")("config:clean-framework-files")
const paths = require("../../../global.paths")
const config = require("../../../global.config")
const Inquirer = require("inquirer")

/**
 * cleanFrameworkFiles
 * @description
 */
const cleanFrameworkFiles = ({
  gitFolder = paths.gitFolder,
  installScriptFile = paths.installScript,
  delay = config.logDelay,
  fakeMode = config.fakeMode,
} = {}) => {
  debug("cleanFrameworkFiles params:", {
    gitFolder,
    installScriptFile,
    delay,
  })

  return new Promise(async (resolve) => {
    const removeGitAnswer = await Inquirer.prompt({
      type: "confirm",
      name: "removeGit",
      message: "Do you want to reset the .git folder?",
    })
    debug("removeGitAnswer", removeGitAnswer["removeGit"])

    if (!fakeMode && removeGitAnswer["removeGit"]) {
      logs.start("Remove .git folder")
      logs.note(`rm -rf ${gitFolder}`)
      await execSync(`rm -rf ${gitFolder}`, 3)
      logs.start("Init new .git folder")
      logs.note(`git init`)
      await execSync(`git init`, 3)
    } else {
      debug("FakeMode is activated or removeGitAnswer is false, do nothing.".red)
    }
    logs.done()
    setTimeout(resolve, delay)
  })
}

module.exports = cleanFrameworkFiles
