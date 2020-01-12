require("colors");
const Inquirer = require("inquirer");
const log = require("debug")("lib:scaffold-component");
const createFile = require("../helpers/create-file");
const config = require("../config");

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

    log("bundleType", bundleType);

    const templateBundleDirPath = `${config.templatesPath}/bundles/${bundleType}`;

    // skaffold bundle folder as src with the response
    if (bundleType === "dom") {
    }
    //
    if (bundleType === "react") {
    }

    resolve();
  });
};

module.exports = bundleScaffolder;
