require("colors")
const { Files } = require("@zouloux/files")
const logs = require("../../../helpers/logs-helper")
const debug = require("debug")("config:setup-gitignore")
const paths = require("../../../global.paths")
const config = require("../../../global.config")

/**
 * Manage Gitignore
 * @returns {Promise<unknown>}
 */
const setupGitignore = ({
  gitignorePath = paths.gitignore,
  logDoneDelay = config.logDelay,
  fakeMode = config.fakeMode,
} = {}) => {
  debug("setupGitignore params:", { gitignorePath })

  return new Promise((resolve) => {
    logs.start(`Setup .gitignore file`)
    if (!fakeMode) {
      Files.getFiles(gitignorePath).alter((fileContent) => {
        return (
          fileContent
            // remove install.cache, we need to add it into git
            .replace(/config\/install.config.js/, `# config/install.config.js`)
        )
      })
    } else {
      debug("FakeMode is activated, do nothing.".red)
    }

    logs.done()
    setTimeout(resolve, logDoneDelay)
  })
}

module.exports = setupGitignore
