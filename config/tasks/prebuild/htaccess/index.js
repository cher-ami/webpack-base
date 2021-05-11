const { Files } = require("@zouloux/files")
const logs = require("../../../helpers/logs-helper")
const debug = require("debug")("config:prebuild-htaccess")
const root = require("app-root-path")

const config = require("../../../global.config")
const paths = require("../../../global.paths")
const OUTPUT_PATH = config.outputPath
const CONFIG_PATH = paths.config

// select first .htaccess in src/.htaccess
// if doesn't exist, take .htaccess from task templates folder
const HTACCESS_TEMPLATE_FILE =
  Files.getFiles(`${paths.src}/.htaccess`).files.length > 0
    ? `${paths.src}/.htaccess`
    : CONFIG_PATH + "/tasks/prebuild/htaccess/templates/.htaccess.template"

/**
 * Prebuild .htaccess file
 * Useful is this file
 */
const prebuildHtaccess = () => {
  /**
   * htaccessHtpasswdLink
   * @param pServerWebRootPath
   * @param pNewHtaccessFilePath
   * @returns {string|null}
   */
  const _htpasswdLinkInHtaccess = (
    pNewHtaccessFilePath = newHtaccessFilePath,
    pServerWebRootPath = process.env.HTACCESS_SERVER_WEB_ROOT_PATH
  ) => {
    if (!pServerWebRootPath) return null

    const template = [
      `# Add password
      AuthUserFile ${pServerWebRootPath}.htpasswd
      AuthType Basic
      AuthName "My restricted Area"
      Require valid-user
      `,
    ]
      .join("\n")
      .replace(/  +/g, "")

    Files.getFiles(pNewHtaccessFilePath).append(template)
  }

  /**
   * Create htpasswdFile
   * @type {string}
   */
  const _createHtpasswdFile = (
    outPutPath = OUTPUT_PATH,
    pUser = process.env.HTACCESS_AUTH_USER,
    pPassword = process.env.HTACCESS_AUTH_PASSWORD
  ) => {
    debug("_createHtpasswdFile...")
    debug("_createHtpasswdFile params", {
      outPutPath,
      pUser,
      pPassword,
    })
    // check
    if (!outPutPath || !pUser || !pPassword) {
      debug("Missing param, aborting.")
      return
    }
    // create htpasswd file and add password in it
    const htpasswdFilePath = `${outPutPath}/.htpasswd`
    debug("htpasswdFilePath", htpasswdFilePath)

    // define content
    const htpasswdContent = `${pUser}:${pPassword}`
    debug("htpasswdContent", htpasswdContent)

    // write content user:pass in htpasswd file
    Files.new(htpasswdFilePath).write(htpasswdContent)
  }

  /**
   * rewrite http To https
   * @param pNewHtaccessFilePath
   * @returns {string|null}
   */
  const _rewriteHttpToHttpsInHtaccess = (pNewHtaccessFilePath = newHtaccessFilePath) => {
    debug("_rewriteHttpToHttpsInHtaccess...")
    debug("_rewriteHttpToHttpsInHtaccess params", {
      pNewHtaccessFilePath,
    })

    const template = [
      `# Force http to https
      RewriteCond %{HTTPS}  !=on
      RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R,L]
     `,
    ]
      .join("\n")
      .replace(/  +/g, "")

    Files.getFiles(pNewHtaccessFilePath).append(template)
  }

  /**
   * Create htaccess file
   * @param pOutputPath
   * @param htaccessTemplateFile
   * @private
   */
  const _createHtaccessFile = (
    pOutputPath = OUTPUT_PATH,
    htaccessTemplateFile = HTACCESS_TEMPLATE_FILE
  ) => {
    debug("create htaccess file...")
    // target htaccess new file
    const newHtaccessFilePath = `${pOutputPath}/.htaccess`
    debug("newHtaccessFilePath", newHtaccessFilePath)
    Files.new(newHtaccessFilePath).write(Files.getFiles(htaccessTemplateFile).read())
    return { newHtaccessFilePath }
  }

  logs.start("Prebuild htaccess")

  // create htaccess file and get returned newHtaccessFilePath
  const { newHtaccessFilePath } = _createHtaccessFile()

  logs.note(`htaccess path: ${newHtaccessFilePath}`)

  if (process.env.HTACCESS_ENABLE_AUTH === "true") {
    _createHtpasswdFile()
    _htpasswdLinkInHtaccess()
  }
  if (process.env.HTACCESS_ENABLE_HTTPS_REDIRECTION === "true") {
    _rewriteHttpToHttpsInHtaccess()
  }

  logs.done()
}

module.exports = prebuildHtaccess
