const { Files } = require("@zouloux/files");
const { logs } = require("../../helpers/logs-helper");
const debug = require("debug")("config:prebuild-htaccess");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// config
const globalConfig = require("../../global.config");
// paths
const paths = require("../../global.paths");

// ----------------------------------------------------------------------------- MODULE

/**
 * Prebuild .htaccess file
 * Useful is this file
 */
const prebuildHtaccess = (_) => {
  //
  let currentEnv = process.env.ENV || null;
  debug("process env ENV", currentEnv);

  // --------------------------------------------------------------------------- PRIVATE

  /**
   * Header
   * @param pEnvName
   * @param pNewHtaccessFilePath
   * @returns {string}
   */
  const _headerMessage = (
    pEnvName = null,
    pNewHtaccessFilePath = newHtaccessFilePath
  ) => {
    const template = [
      `
      ## ${pEnvName} additional htaccess configuration
      `,
    ]
      .join("\n")
      .replace(/  +/g, "");

    if (pEnvName) {
      // write new htaccess file
      Files.getFiles(pNewHtaccessFilePath).append(template);
    }
  };

  /**
   * htaccessHtpasswdLink
   * @param pServerWebRootPath
   * @param pNewHtaccessFilePath
   * @returns {string|null}
   */
  const _addHtpasswdLinkInHtaccess = (
    pServerWebRootPath = process.env.SERVER_WEB_ROOT_PATH,
    pNewHtaccessFilePath = newHtaccessFilePath
  ) => {
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

    if (!pServerWebRootPath) return null;
    Files.getFiles(pNewHtaccessFilePath).append(template);
  };

  /**
   * Create htpasswdFile
   * @type {string}
   */
  const _createHtpasswdFile = (
    outPutPath = paths.dist,
    pHtpasswdUser = process.env.HTPASSWD_USER,
    pHtpasswdEncryptPassword = process.env.HTPASSWD_ENCRYPT_PASSWORD
  ) => {
    debug("_createHtpasswdFile...");
    debug("_createHtpasswdFile params", {
      outPutPath,
      pHtpasswdUser,
      pHtpasswdEncryptPassword,
    });
    // check
    if (!outPutPath || !pHtpasswdUser || !pHtpasswdEncryptPassword) {
      debug("Missing param, aborting.");
      return;
    }

    // create htpasswd file and add password in it
    const htpasswdFilePath = `${outPutPath}/.htpasswd`;
    debug("htpasswdFilePath", htpasswdFilePath);

    // define content
    const htpasswdContent = `${pHtpasswdUser}:${pHtpasswdEncryptPassword}`;
    debug("htpasswdContent", htpasswdContent);

    // write content user:pass in htpasswd file
    Files.new(htpasswdFilePath).write(htpasswdContent);
  };

  /**
   * rewriteHttpToHttps
   * @param pRewriteCondHttpHostUrl
   * @param pNewHtaccessFilePath
   * @returns {string|null}
   */
  const _addRewriteHttpToHttpsInHttaccess = (
    pRewriteCondHttpHostUrl = process.env.REWRITE_COND_HTTP_HOST_URL,
    pNewHtaccessFilePath = newHtaccessFilePath
  ) => {
    debug("_addRewriteHttpToHttpsToHttaccess...");
    debug("_addRewriteHttpToHttpsToHttaccess params", {
      pRewriteCondHttpHostUrl,
      pNewHtaccessFilePath,
    });

    // check if process env value exist
    if (!pRewriteCondHttpHostUrl) {
      debug("Missing param, aborting.");
      return null;
    }

    const template = [
      `# Force from http to https
     RewriteCond %{HTTPS} off
     RewriteCond %{HTTP_HOST} =${pRewriteCondHttpHostUrl}
     RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301]
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
  const _createHtacessFile = (
    pOutputPath = paths.dist,
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

    return {
      newHtaccessFilePath,
    };
  };
  // --------------------------------------------------------------------------- PUBLIC

  logs.start("Prebuild htaccess.");

  // create htaccess file and get newHtaccessFilePath
  const { newHtaccessFilePath } = _createHtacessFile();
  // add header
  _headerMessage(currentEnv);

  if (currentEnv === "staging") {
    // create htpasswd file
    _createHtpasswdFile();
    // add password to htaccess
    _addHtpasswdLinkInHtaccess();
  }

  if (currentEnv === "production") {
    // add rewrite http to https
    _addRewriteHttpToHttpsInHttaccess();
  }

  logs.done();
};

module.exports = { prebuildHtaccess };
