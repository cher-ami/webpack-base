const { Files } = require("@zouloux/files");
const debug = require("debug")("config:prebuild-dotenv");
const { logs } = require("../../helpers/logs-helper");
const config = require("../../global.config");
const paths = require("../../global.paths");

/**
 * Prebuild .env file
 * Create and inject .env file in specific folder (dist/ by default)
 */
const prebuildDotEnv = (destinationPath = config.outputPath) => {
  return new Promise((resolve) => {
    logs.start(`Prebuild .env in ${destinationPath} folder`);
    debug("process.env.ENV", process.env.ENV);

    // env file we want to inject in output path
    const newFilePath = `${destinationPath}/.env`;
    // select param env or process env or null
    let selectedEnv = process.env.ENV || null;

    selectedEnv
      ? logs.note(`Selected env is ${selectedEnv}`)
      : logs.note(`There is no selected env, we use content of default .env`);

    // env extension depend on currentEnv
    const envNameExtension = selectedEnv === "development" ? "" : selectedEnv;
    debug("envNameExtension", envNameExtension);

    const dotEnvFileName = `.env${
      envNameExtension !== "" ? `.${envNameExtension}` : ""
    }`;

    logs.note(`dotEnv file used is: ${dotEnvFileName}`);

    // build template file path
    const templateFilePath = `${paths.root}/${dotEnvFileName}`;

    debug({ envNameExtension, dotEnvFileName, newFilePath, templateFilePath });

    // read .env
    const envFile = Files.getFiles(templateFilePath).read();

    // prettier-ignore
    const keepingEnvVarsArray = envFile
      .split("\n")
      .map((el) => {
        const isComment = el.includes("#");
        const isEmptyLine = el === "";
        const containsEqual = el.includes("=");
        if (
            !isEmptyLine && 
            !isComment && 
            containsEqual
        ) {
          const varName = el.split("=")[0];
          return varName ? varName : null;
        }
      })
      .filter((e) => e);

    // create template with varNames and process.env values
    const template = keepingEnvVarsArray
      .map((el) => `${el}=${process.env[el]}`)
      .join("\n");

    debug("template", template);

    debug("write .env file...");
    Files.new(newFilePath).write(template);

    logs.note(`write "VERSION=..." in dist/.env file...`);
    Files.getFiles(newFilePath).alter((fileContent) => {
      return fileContent.replace(
        /VERSION=/,
        `VERSION=${require("../../../package").version}`
      );
    });

    logs.done();
    resolve();
  });
};

module.exports = { prebuildDotEnv };
