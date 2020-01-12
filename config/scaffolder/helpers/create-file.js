const { Files } = require("@zouloux/files");
const { QuickTemplate } = require("./template-helper");
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
    console.log(`This file already exists. Aborting.`.red.bold);
    return;
  }

  // create file with template
  Files.new(destinationFilePath).write(
    QuickTemplate(Files.getFiles(templateFilePath).read(), replaceExpressions)
  );
};

module.exports = createFile;
