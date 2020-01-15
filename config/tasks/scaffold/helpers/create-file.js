const { Files } = require("@zouloux/files");
const { QuickTemplate } = require("./template-helper");
const log = require("debug")("lib:create-file");
require("colors");

/**
 * Create File with template
 * @param templateFilePath: path/to/templates/components/foo.template
 * @param destinationFilePath: Where we want to create file ex: "path/to/file/foo.tsx"
 * @param replaceExpressions Expressions list to replace
 */
const createFile = ({
  templateFilePath = "",
  destinationFilePath = "",
  replaceExpressions = {}
}) => {
  // Check if component already exists
  if (Files.getFiles(destinationFilePath).files.length > 0) {
    console.log(`This file already exists. Aborting.`.red);
    return;
  }

  log("create file with template and replace expression");
  Files.new(destinationFilePath).write(
    QuickTemplate(Files.getFiles(templateFilePath).read(), replaceExpressions)
  );
};

module.exports = createFile;
