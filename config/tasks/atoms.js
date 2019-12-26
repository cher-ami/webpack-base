const { Files } = require("@zouloux/files");
const path = require("path");
const paths = require("../paths");
const debug = require("debug")("config:prebuild-atoms");

// ----------------------------------------------------------------------------- PRIVATE

// create template
const _atomsTemplate = (
  pAtomList,
  pFileTabRegex = new RegExp(`(\n${"\t\t\t"})`, "gmi")
) => {
  return `
			/**
			 * WARNING
			 * Auto-generated file, do not edit!
			 *
			 * Only updated when webpack is launched.
			 * Data are extracted from all less files inside atoms/ directory.
			 */
			export const Atoms =
			{\n${pAtomList
        .map(atom => {
          return `	"${atom.name}": ${atom.value},`;
        })
        .join("\n")}
			};`.replace(pFileTabRegex, "\n");
};

/**
 * Parse atoms list
 * return {array}
 */
const _atomsParser = () => {
  // TODO: pass atoms path and glob as param
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

  return atomList;
};

// ----------------------------------------------------------------------------- PUBLIC

module.exports = {
  /**
   * Generate atoms typescript file from less files inside atoms directory
   * Return a promise
   */
  prebuildAtoms: ({
    pOutputPath = paths.atomsPath,
    pOutputFilename = paths.atomsGenerateFilename
  }) =>
    new Promise(resolve => {
      // get atoms list
      const atomList = _atomsParser();

      // Generate File path
      const generatedFilePath = `${pOutputPath}/${pOutputFilename}`;

      // create current file var
      let currentFile;

      // If file exist
      if (Files.getFiles(generatedFilePath).files.length > 0) {
        // register file content
        currentFile = Files.getFiles(generatedFilePath).read();
      }

      debug("file as changed? :", currentFile !== _atomsTemplate(atomList));

      // check if current file is the same than the new one
      if (currentFile === _atomsTemplate(atomList)) return;

      debug("Write new atoms file...");

      // Write atoms typescript files
      Files.new(generatedFilePath).write(_atomsTemplate(atomList));

      // resolove promise
      resolve();
    })
};
