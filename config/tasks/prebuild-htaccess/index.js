const bcrypt = require("bcrypt");
const { Files } = require("@zouloux/files");
const { logs } = require("../../helpers/logs-helper");
const debug = require("debug")("config:prebuild-htaccess");
const config = require("../../global.config");
const paths = require("../../global.paths");

/**
 * Prebuild .htaccess file
 * Useful is this file
 */
const prebuildHtaccess = () => {
  // --------------------------------------------------------------------------- PRIVATE

  /**
   * htaccessHtpasswdLink
   * @param pServerWebRootPath
   * @param pNewHtaccessFilePath
   * @returns {string|null}
   */
  const _htpasswdLinkInHtaccess = (
    pServerWebRootPath = process.env.HTACCESS_SERVER_WEB_ROOT_PATH,
    pNewHtaccessFilePath = newHtaccessFilePath
  ) => {
    if (!pServerWebRootPath) return null;

    const template = [
      `# Add password
      AuthUserFile ${pServerWebRootPath}.htpasswd
      AuthType Basic
      AuthName "My restricted Area"
      Require valid-user
      `,
    ]
      .join("\n")
      .replace(/  +/g, "");

    Files.getFiles(pNewHtaccessFilePath).append(template);
  };

  /**
   * Create htpasswdFile
   * @type {string}
   */
  const _createHtpasswdFile = (
    outPutPath = config.outputPath,
    pUser = process.env.HTACCESS_AUTH_USER,
    pPassword = process.env.HTACCESS_AUTH_PASSWORD
  ) => {
    debug("_createHtpasswdFile...");
    debug("_createHtpasswdFile params", {
      outPutPath,
      pUser,
      pPassword,
    });
    // check
    if (!outPutPath || !pUser || !pPassword) {
      debug("Missing param, aborting.");
      return;
    }
    // create htpasswd file and add password in it
    const htpasswdFilePath = `${outPutPath}/.htpasswd`;
    debug("htpasswdFilePath", htpasswdFilePath);

    // hash pass with bCrypt
    let hashPassword = bcrypt.hashSync(pPassword, 10);
    debug("hash", hashPassword);

    // define content
    const htpasswdContent = `${pUser}:${hashPassword}`;
    debug("htpasswdContent", htpasswdContent);

    // write content user:pass in htpasswd file
    Files.new(htpasswdFilePath).write(htpasswdContent);
  };

  /**
   * rewrite http To https
   * @param pNewHtaccessFilePath
   * @returns {string|null}
   */
  const _rewriteHttpToHttpsInHtaccess = (
    pNewHtaccessFilePath = newHtaccessFilePath
  ) => {
    debug("_rewriteHttpToHttpsInHtaccess...");
    debug("_rewriteHttpToHttpsInHtaccess params", {
      pNewHtaccessFilePath,
    });

    const template = [
      `# Force http to https
      RewriteCond %{HTTPS}  !=on
      RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R,L]
     `,
    ]
      .join("\n")
      .replace(/  +/g, "");

    Files.getFiles(pNewHtaccessFilePath).append(template);
  };

  /**
   *
   * @param pOutputPath
   * @param pConfigPath
   * @private
   */
  const _createHtaccessFile = (
    pOutputPath = config.outputPath,
    pConfigPath = paths.config
  ) => {
    // target htaccess new file
    const newHtaccessFilePath = `${pOutputPath}/.htaccess`;
    debug("newHtaccessFilePath", newHtaccessFilePath);

    // target htaccess template
    const templateFilePath =
      pConfigPath + "/tasks/prebuild-htaccess/templates/.htaccess.template";
    debug("templateFilePath", templateFilePath);

    debug("write htaccess file");
    Files.new(newHtaccessFilePath).write(
      Files.getFiles(templateFilePath).read()
    );

    return { newHtaccessFilePath };
  };
  // --------------------------------------------------------------------------- PUBLIC

  logs.start("Prebuild htaccess.");

  // create htaccess file and get returned newHtaccessFilePath
  const { newHtaccessFilePath } = _createHtaccessFile();

  if (process.env.HTACCESS_ENABLE_AUTH === "true") {
    _createHtpasswdFile();
    _htpasswdLinkInHtaccess();
  }
  if (process.env.HTACCESS_ENABLE_HTTPS_REDIRECTION === "true") {
    _rewriteHttpToHttpsInHtaccess();
  }

  logs.done();
};

module.exports = { prebuildHtaccess };
