const { Files } = require("@zouloux/files");
const debug = require("debug")("config:prebuild-dotenv");
const logs = require("../../helpers/logs-helper");
const config = require("../../global.config");
const root = require("app-root-path");

/**
 * Prebuild .env file
 * Create and inject .env file in specific folder
 */
const prebuildDotEnv = (newFilePath = `${config.outputPath}/.env`) => {
  return new Promise((resolve) => {
    // read all .env files and get all var names
    const envFiles = Files.getFiles(root.resolve(".env*")).files;
    debug("available env files", envFiles);

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
            const isComment = el.includes("#");
            const isEmptyLine = el === "";
            const containsEqual = el.includes("=");
            if (!isEmptyLine && !isComment && containsEqual) {
              const varName = el.split("=")[0];
              return varName ? varName : null;
            }
          })
          // remove empty lines
          .filter((e) => e)
      )
      // flat arrays results
      .flat()
      // remove double entries
      .filter((elem, index, self) => index === self.indexOf(elem));

    debug("available vars after merge vars from all .env files", vars);

    let template;
    // create template with varNames and process.env values
    template = vars.map((el) => process.env[el] && `${el}=${process.env[el]}`);

    // push current version in it
    template.push(`VERSION=${require("../../../package").version}`);

    // filter to remove empty lines
    template = template.filter((e) => e).join("\n");
    debug("template to write in file", template);

    debug("write .env file...");
    Files.new(newFilePath).write(template);

    logs.done();
    resolve();
  });
};

module.exports = prebuildDotEnv;
