require("colors");
const path = require("path");
const Inquirer = require("inquirer");
const paths = require("../paths");
const { Files } = require("@zouloux/files");
const log = require("debug")("lib:scaffold-component");
const { logs } = require("../../../_common/helpers/logs-helper");

// ----------------------------------------------------------------------------- PRIVATE

const _askBundleType = () => {
  return Inquirer.prompt({
    type: "list",
    name: "bundleType",
    message: "Witch Bundle project type do you want to create?",
    choices: paths.bundleType
  });
};

const _askCreateNewBundle = () => {
  return Inquirer.prompt({
    type: "confirm",
    message: `Are you sure you want to continue? This action will erase all "src/" folder content, exept "common/" folder.`,
    name: "createNewBundle",
    default: false
  });
};

/**
 * @name _removeCurrentBundle
 * @description Remove the current bundle before create new one
 */
const _removeCurrentBundle = async ({ destinationFolder }) => {
  // get all fles from destinationFolder
  const currentBundleFiles = Files.any(`${destinationFolder}/**/**/**/**/**/**`)
    .files;

  // filter each files who are not in common folder
  currentBundleFiles.map(el => {
    if (
      // if el is destination folder
      el === destinationFolder ||
      // or if el contains "src/common folder inside path
      // TODO common should be a variable
      el.includes(`${destinationFolder}/common`)
    )
      // do nothing
      return;

    // delete the file
    Files.any(el).delete();
  });
};

/**
 * @name _bundleBuilder
 * @description Build bundle
 * @param firstScaffold
 * @param templateBundleDirPath
 * @param destinationFolder
 * @private
 */
const _bundleBuilder = async ({
  firstScaffold = false,
  templateBundleDirPath,
  destinationFolder = paths.bundlePath
}) => {
  // if is not the first scaffold
  if (!firstScaffold) {
    // ask if we are sure to want to create new bundle
    let createNewBundle = false;
    await _askCreateNewBundle().then(
      resolve => (createNewBundle = resolve.createNewBundle)
    );

    // if response is false
    if (!createNewBundle) {
      logs.error(`No bundle created. Aborting`);
      return;
    }
  }

  // remove current bundle selected files
  await _removeCurrentBundle({ destinationFolder });

  // copy template bundle directory content files in new bundle directory
  Files.any(`${templateBundleDirPath}/*`).copyTo(`${destinationFolder}/`);

  // loop on each files in new directory
  Files.any(`${destinationFolder}/**/**/*`).files.map(el => {
    // if file name contains ".template" extension
    if (el.endsWith(".template")) {
      // get new file path witout extention
      const filePathWithoutExt = `${path.parse(el).dir}/${path.parse(el).name}`;

      // write this new file witout extension
      Files.new(filePathWithoutExt).write(Files.getFiles(el).read());

      // delete old file
      Files.getFiles(el).delete();

      // final log
      logs.done("Bundle created.");
    }
  });
};

// ----------------------------------------------------------------------------- PUBLIC

/**
 * @name scaffoldBundle
 * @returns {Promise<unknown>}
 */
const scaffoldBundle = async (firstScaffold = false) => {
  return new Promise(async resolve => {
    // create bundle type var
    let bundleType = "";
    // get bundle type with prompt
    await _askBundleType().then(resolve => (bundleType = resolve.bundleType));

    // get template dir path
    const templateBundleDirPath = `${paths.templatesPath}/bundles/${bundleType}`;

    // scaffold bundle folder as src with the response
    await _bundleBuilder({ firstScaffold, templateBundleDirPath });

    resolve();
  });
};

module.exports = scaffoldBundle;
