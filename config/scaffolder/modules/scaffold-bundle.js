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

const _reactBundleBuilder = ({
  bundleType = "react",
  templateBundleDirPath,
  destinationFolder = config.bundlePath
}) => {
  const { Files } = require("@zouloux/files");

  //log({ bundleType, templateBundleDirPath, destinationFolder });

  // // scaffold index entry file
  // createFile({
  //   templateFilePath: `${templateBundleDirPath}/index.ts.template`,
  //   destinationFilePath: `${destinationFolder}/index.ts`,
  // });
  //
  // // scaffold Main tsx
  // createFile({
  //   templateFilePath: `${templateBundleDirPath}/Main.tsx.template`,
  //   destinationFilePath: `${destinationFolder}/Main.tsx`,
  // });
  //
  // // scaffold Main tsx
  // createFile({
  //   templateFilePath: `${templateBundleDirPath}/Main.less.template`,
  //   destinationFilePath: `${destinationFolder}/Main.less`,
  // });
  //
  // // scaffold Main tsx
  // createFile({
  //   templateFilePath: `${templateBundleDirPath}/stores/*`,
  //   destinationFilePath: `${destinationFolder}/`,
  // });

  const bundleFiles = Files.any(`${templateBundleDirPath}/**/**/*`).files;

  log(bundleFiles);

  // copy all content
  Files.any(`${templateBundleDirPath}/*`).copyTo(`${destinationFolder}/`);

  // re write each files in new directory
  Files.any(`${destinationFolder}/**/**/*`).files.map(el => {
    // if file name contains ".template" extension
    if (el.endsWith(".template")) {
      // get new file path witout extention
      const filePath = path.parse(el).dir;
      const fileName = path.parse(el).name;
      const filePathWithoutExt = `${filePath}/${fileName}`;

      log("filePathWithoutExt", filePathWithoutExt);
      log("new file", el);

      // write this new file witout extension
      Files.new(filePathWithoutExt).write(Files.getFiles(el).read());

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
