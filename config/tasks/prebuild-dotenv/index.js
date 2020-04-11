const { Files } = require("@zouloux/files");
const debug = require("debug")("config:prebuild-dotenv");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// logs
const { logs } = require("../../helpers/logs-helper");
// config
const config = require("../../global.config");
// paths
const paths = require("../../global.paths");

// ----------------------------------------------------------------------------- MODULE

/**
 * Prebuild .env file
 * Create and inject .env file in specific folder (dist/ by default)
 */
const prebuildDotenv = (pEnv) => {
  return new Promise((resolve) => {
    // env file we want to inject in dist folder
    const newFilePath = `${paths.dist}/.env`;

    debug(" process.env.ENV", process.env.ENV);
    // select param env or process env or null
    let selectedEnv = pEnv || process.env.ENV || null;

    logs.start(
      `Prebuild .env in dist/ folder with ${selectedEnv} selected env...`
    );
    // env extension depend on currentEnv
    const envNameExtension =
      selectedEnv !== "" && selectedEnv !== undefined && selectedEnv !== null
        ? `.${selectedEnv}`
        : "";

    // build template file path
    const templateFilePath = `${paths.root}/.env${envNameExtension}`;
    logs.note(`envNameExtension: ${envNameExtension}`);
    debug({ pEnv, envNameExtension, newFilePath, templateFilePath });

    debug("write env file...");
    Files.new(newFilePath).write(Files.getFiles(templateFilePath).read());

    logs.start(`write "VERSION=..." in dist/.env file...`);
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
      // write APP_URL
      Files.getFiles(newFilePath).alter((fileContent) => {
        return fileContent.replace(
          /APP_URL=/,
          `APP_URL=${process.env.APP_URL}`
        );
      });

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
