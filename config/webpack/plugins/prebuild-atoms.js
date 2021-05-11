const { Files } = require("@zouloux/files")
const path = require("path")
const paths = require("../../global.paths")
const debug = require("debug")("config:prebuild-atoms")
const changeCase = require("change-case")

/**
 * Create atoms less to JS template
 */
const _atomsTemplate = (
  pAtomList,
  pOutputFilename = "atoms",
  pFileTabRegex = new RegExp(`(\n${"\t\t\t"})`, "gmi")
) => {
  // get output file name without extensions
  const outputFilenameWitoutExtension = pOutputFilename.split(".")[0]

  return `
			/**
			 * WARNING
			 * Auto-generated file, do not edit!
			 * Auto-Updated with HMR and generated on production build.
			 * This file is ignored in .gitignore 
			 */
			export const ${outputFilenameWitoutExtension} = {
			${pAtomList
        .map((atom) => {
          return `	"${atom.name}": ${atom.value},`
        })
        .join("\n")}
			};`.replace(pFileTabRegex, "\n")
}

/**
 * Parse atoms list
 * @param pWatcher Files to parse
 * @returns {[]}
 * @private
 */
const _atomsParser = (pWatcher) => {
  // Get less files
  const atomsLessFiles = Files.getFiles(pWatcher)

  // Generated atoms list
  let atomList = []

  // Browse less files
  atomsLessFiles.all((lessFile) => {
    // Read less file
    const lessContent = Files.getFiles(lessFile).read()

    // Browse lines
    lessContent.split("\n").map((el) => {
      // Trim line
      el = el.trim()
      // Get @ index (starting of a new less var)
      const atIndex = el.indexOf("@")
      // If @ is not at first index (we are trimmed), next
      if (atIndex !== 0) return
      // Get colon index (starting of a value in less)
      const colonIndex = el.indexOf(":")
      // If there is no value on this line, next
      if (colonIndex === -1) return
      // Get optionnal semi colon index
      const semiIndex = el.indexOf(";")
      // Extract var name and trim it
      const varName = el.substring(atIndex + 1, colonIndex).trim()
      // Extract value and trim it
      const varValue = el.substring(colonIndex + 1, Math.min(el.length, semiIndex)).trim()
      // final name
      const name = changeCase.camelCase(varName)

      // final value
      const value =
        // if value is a number
        !isNaN(varValue) ||
        // or if value already begin and ending with quote
        varValue.charAt(0) === "'" ||
        varValue.charAt(0) === '"'
          ? // return value without formating
            varValue
          : // return value with quote
            "'" + varValue + "'"

      // Add this atom
      atomList.push({ name, value })
    })
  })

  return atomList
}

module.exports = {
  /**
   * Generate atoms typescript file from less files inside atoms directory
   * Return a promise
   */
  prebuildAtoms: ({
    pWatcher = paths.atomsFilesToWatch,
    pOutputPath = paths.atomsPath,
    pOutputFilename = paths.atomsGeneratedFilename,
  }) =>
    new Promise((resolve) => {
      // Generate File path
      const generatedFilePath = `${pOutputPath}/${pOutputFilename}`
      // get atoms list
      const atomList = _atomsParser(pWatcher)
      // get template
      const template = _atomsTemplate(atomList, pOutputFilename)

      debug("Write new atoms file...")
      Files.new(generatedFilePath).write(template)

      debug("Done.")
      resolve()
    }),
}
