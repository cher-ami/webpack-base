const { Files } = require("@zouloux/files");
const debug = require("debug")("config:prebuild-dotenv");

// ----------------------------------------------------------------------------- PATHS / CONFIG

const { logs } = require("../../helpers/logs-helper");
const config = require("../../global.config");
const paths = require("../../global.paths");

// ----------------------------------------------------------------------------- MODULE

/**
 * Prebuild .env file
 * Create and inject .env file in specific folder (dist/ by default)
 */
const prebuildDotenv = (pEnv) => {
  return new Promise((resolve) => {
    logs.start(`Prebuild .env in dist/ folder`);
    debug("process.env.ENV", process.env.ENV);

    // env file we want to inject in dist folder
    const newFilePath = `${paths.dist}/.env`;
    // select param env or process env or null
    let selectedEnv = pEnv || process.env.ENV || null;

    selectedEnv
      ? logs.note(`Selected en is ${selectedEnv}`)
      : logs.note(`There is no selected env, we use content of default .env`);

    // env extension depend on currentEnv
    const envNameExtension =
      selectedEnv !== "" && selectedEnv !== undefined && selectedEnv !== null
        ? `.${selectedEnv}`
        : "";

    // build template file path
    const templateFilePath = `${paths.root}/.env${envNameExtension}`;
    debug({ pEnv, envNameExtension, newFilePath, templateFilePath });

    debug("write env file...");
    Files.new(newFilePath).write(Files.getFiles(templateFilePath).read());

    logs.note(`write "VERSION=..." in dist/.env file...`);
    Files.getFiles(newFilePath).alter((fileContent) => {
      return fileContent.replace(
        /VERSION=/,
        `VERSION=${require("../../../package").version}`
      );
    });

    /**
     * Only for .env.lamp
     */
    if (selectedEnv === "lamp") {
      // write APP_BASE set by gitlab-ci.yaml
      Files.getFiles(newFilePath).alter((fileContent) => {
        return fileContent.replace(
          /APP_BASE=/,
          `APP_BASE=${process.env.APP_BASE}`
        );
      });
    }

    logs.done();
    resolve();
  });
};

module.exports = { prebuildDotenv };
