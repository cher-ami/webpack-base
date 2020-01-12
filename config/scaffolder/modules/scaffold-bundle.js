require("colors");
const path = require("path");
const Inquirer = require("inquirer");
const log = require("debug")("lib:scaffold-component");
const createFile = require("../helpers/create-file");
const config = require("../config");
const { Files } = require("@zouloux/files");

// ----------------------------------------------------------------------------- PRIVATE

/**
 * Ask bundle Type to scaffold
 */
const _askBundleType = () => {
  return Inquirer.prompt({
    type: "list",
    name: "bundleType",
    message: "bundle Type?",
    choices: config.bundleType
  });
};

// prettier-ignore
const _reactBundleBuilder = ({
  bundleType = "react",
  templateBundleDirPath,
  destinationFolder = config.bundlePath
}) => {

  if (Files.getFiles(`${destinationFolder}/index.ts`).files.length > 0) {
    console.log(`src/index.ts exist.`.red);
    console.log(`Bundle type as been already setup. Aborting.`.red);
    return;
  }

  // copy template bundle directory content files in new bundle directory
  Files.any(`${templateBundleDirPath}/*`).copyTo(`${destinationFolder}/`);

  // loop on each files in new directory
  Files.any(`${destinationFolder}/**/**/*`).files.map(el => {

    // if file name contains ".template" extension
    if (el.endsWith(".template")) {

      // get new file path witout extention
      const filePathWithoutExt = `${path.parse(el).dir}/${path.parse(el).name}`;

      // Check if component already exists
      if (Files.getFiles(filePathWithoutExt).files.length > 0) {
        console.log(`This file already exists. Aborting.`.red);
        return;
      }

      // write this new file witout extension
      Files.new(filePathWithoutExt).write(Files.getFiles(el).read());

      // delete old file
      Files.getFiles(el).delete();
    }
  });
};

//
const _domBundleBuilder = ({ bundleType = "dom", templateBundleDirPath }) => {};

// ----------------------------------------------------------------------------- PUBLIC

/**
 *
 * @returns {Promise<unknown>}
 */
const bundleScaffolder = () => {
  return new Promise(async resolve => {
    // get bundle type with prompt
    let bundleType = "";
    await _askBundleType().then(resolve => (bundleType = resolve.bundleType));

    // get template dir path
    const templateBundleDirPath = `${config.templatesPath}/bundles/${bundleType}`;

    // scaffold bundle folder as src with the response
    //
    if (bundleType === "react") {
      _reactBundleBuilder({ templateBundleDirPath });
    }

    if (bundleType === "dom") {
      _reactBundleBuilder({ templateBundleDirPath });
    }

    console.log(`→ ${"bundle created!"}\n`.cyan);
    resolve();
  });
};

module.exports = bundleScaffolder;
