const { Files } = require("@zouloux/files");
const path = require("path");
const paths = require("../paths");
const fileTabs = "\t\t\t";
const fileTabRegex = new RegExp(`(\n${fileTabs})`, "gmi");

/**
 * Generate atoms typescript file from less files inside atoms directory
 */
module.exports = preBuildAtoms = () => {
  const atomsTemplate = atoms =>
    `
			/**
			 * WARNING
			 * Auto-generated file, do not edit!
			 *
			 * Only updated when webpack is launched.
			 * Data are extracted from all less files inside atoms/ directory.
			 */
			export const Atoms =
			{\n${atoms}
			};`.replace(fileTabRegex, "\n");

  // Get less files
  const atomsLessFiles = Files.getFiles(`${paths.atomsPath}/partials/*.less`);

  // Generated atoms list
  let atomList = [];

  // Browse less files
  atomsLessFiles.all(lessFile => {
    // Read less file
    const lessContent = Files.getFiles(lessFile).read();

    // Browse lines
    lessContent.split("\n").map(split => {
      // Trim line
      split = split.trim();

      // Get @ index (starting of a new less var)
      const atIndex = split.indexOf("@");

      // If @ is not at first index (we are trimmed), next
      if (atIndex !== 0) return;

      // Get colon index (starting of a value in less)
      const colonIndex = split.indexOf(":");

      // If there is no value on this line, next
      if (colonIndex === -1) return;

      // Get optionnal semi colon index
      const semiIndex = split.indexOf(";");

      // Extract var name and trim it
      const varName = split.substring(atIndex + 1, colonIndex).trim();

      // Extract value and trim it
      const value = split
        .substring(colonIndex + 1, Math.min(split.length, semiIndex))
        .trim();

      // Add this atom
      atomList.push({
        // Var name
        name: varName,

        // Var value add quotes of not already there
        value:
          value.charAt(0) === "'" || value.charAt(0) === '"'
            ? value
            : "'" + value + "'"
      });
    });
  });

  // File to generate
  const generatedFilePath = `${paths.src}/atoms/atomsAutoGenerate.ts`;

  // create current file var
  let currentFile;

  // If file exist
  if (Files.getFiles(generatedFilePath).files.length > 0) {
    // register file content
    currentFile = Files.getFiles(generatedFilePath).read();
  }

  // prepare template for new file
  const prepareNewFile = atomsTemplate(
    atomList
      .map(atom => {
        return `	"${atom.name}": ${atom.value},`;
      })
      .join("\n")
  );

  console.log("currentFile === prepareNewFile", currentFile === prepareNewFile);
  // check if current file is the same than the new one
  if (currentFile === prepareNewFile) return;

  // Write atoms typescript files
  Files.new(generatedFilePath).write(prepareNewFile);
};
