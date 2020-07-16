require("colors");
const path = require("path");
const Inquirer = require("inquirer");
const { Files } = require("@zouloux/files");
const { logs } = require("../../helpers/logs-helper");
const changeCase = require("change-case");
const debug = require("debug")("config:scaffold-bundle");
const { quickTemplate } = require("../../helpers/template-helper");

// ----------------------------------------------------------------------------- CONFIG

// remove Files lib logs
Files.setVerbose(false);

// get local task path
const paths = require("../../global.paths");
// get local task config
const config = require("../../global.config");

// ----------------------------------------------------------------------------- PRIVATE

const _askBundleType = (bundleType = config.bundleType) => {
  return Inquirer.prompt({
    type: "list",
    name: "bundleType",
    message: "Witch Bundle project type do you want to create?",
    choices: bundleType,
  });
};

const _askBundleName = (defaultBundleName = "main") => {
  return Inquirer.prompt({
    type: "input",
    name: "bundleName",
    message: "What's the new bundle name?",
    default: defaultBundleName,
  });
};

const _askCreateNewBundle = (bundleName) => {
  return Inquirer.prompt({
    type: "confirm",
    message: `Are you sure you want to create ${bundleName} bundle? `,
    name: "createNewBundle",
    default: false,
  });
};

/**
 * @name _bundleBuilder
 * @description Build bundle
 * @param firstScaffold
 * @param templateBundleDirPath
 * @param destinationFolder
 * @param bundleName
 * @private
 */
const _bundleBuilder = async ({
  firstScaffold = false,
  templateBundleDirPath,
  destinationFolder = paths.src,
  bundleName,
}) => {
  // if is not the first bundle scaffold
  if (!firstScaffold) {
    // ask if we are sure to want to create new bundle
    let createNewBundle = false;
    await _askCreateNewBundle(bundleName).then(
      (resolve) => (createNewBundle = resolve.createNewBundle)
    );
    // if response is false
    if (!createNewBundle) {
      logs.error(`No bundle created. Aborting`);
      return;
    }
  }
  // target new bundle folder to test if he already exist
  const targetNewBundleFolder = Files.any(`${destinationFolder}/${bundleName}`)
    .files;

  debug("targetNewBundleFolder.length > 0", targetNewBundleFolder.length > 0);
  debug('bundleName === "common"', bundleName === "common");

  // check if bundle exist
  if (targetNewBundleFolder.length > 0 || bundleName === "common") {
    logs.error(`Bundle named "${bundleName}" already exist. Aborting.`);
    return;
  }

  debug(
    `copy template bundle directory content files in new bundle directory ${destinationFolder}/${bundleName}`
  );
  Files.any(`${templateBundleDirPath}`).copyTo(
    `${destinationFolder}/${bundleName}`
  );

  // loop on each files in new directory
  Files.any(`${destinationFolder}/${bundleName}/**/**/**/*`).files.map((el) => {
    // get fileName
    const fileName = path.parse(el).name;
    // get BundleName pascal-case format
    const pascalCaseBundleName = changeCase.pascalCase(bundleName);

    // if file name contains ".template" extension
    if (path.extname(el) === ".template") {
      // get new file path witout extension
      let filePathWithoutExt = `${path.parse(el).dir}/${fileName}`;
      // write this new file (witout .template extension)
      Files.new(filePathWithoutExt).write(
        quickTemplate(Files.getFiles(el).read(), {
          BundleName: pascalCaseBundleName,
        })
      );
    }

    // check if filename contains "BundleName"
    if (el.includes("BundleName")) {
      // replace dynamic bundle name by real bundle name
      const formatedfileName = fileName.replace(
        "BundleName",
        pascalCaseBundleName
      );
      // target BundleName.ext without .template
      let orignalFilePathWithoutTemplateExt = `${path.parse(el).dir}/${
        path.parse(el).name
      }`;
      // get new file path without .template extension
      let filePathWithoutExt = `${path.parse(el).dir}/${formatedfileName}`;

      // write this new file (witout .template extension)
      Files.new(filePathWithoutExt).write(
        quickTemplate(Files.getFiles(el).read(), {
          BundleName: pascalCaseBundleName,
        })
      );

      // delete old file with .template extension
      Files.getFiles(orignalFilePathWithoutTemplateExt).delete();
    }

    // Finaly, delete old file with .template extension
    Files.getFiles(el).delete();
  });

  logs.done("Bundle created.");
};

// ----------------------------------------------------------------------------- PUBLIC

/**
 * @name scaffoldBundle
 * @returns {Promise<unknown>}
 */
const scaffoldBundle = async (firstScaffold = false) => {
  return new Promise(async (resolve) => {
    // create bundle type var
    let bundleType = "";
    // get bundle type from prompt
    await _askBundleType().then((resolve) => (bundleType = resolve.bundleType));
    debug("bundleType", bundleType);

    // create bundle name var
    let bundleName = "";
    // get bundle type from promt
    await _askBundleName().then(
      (resolve) => (bundleName = changeCase.paramCase(resolve.bundleName))
    );
    debug("bundleName", bundleName);

    // get template dir path
    const templateBundleDirPath = `${paths.bundlesTemplatesPath}/${bundleType}`;
    debug("templateBundleDirPath", templateBundleDirPath);

    // scaffold bundle folder as src with the response
    await _bundleBuilder({ firstScaffold, templateBundleDirPath, bundleName });
    resolve(bundleType);
  });
};

module.exports = { scaffoldBundle };
