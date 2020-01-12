/**
 * Ask bundle Type to
 */
const askBundleType = () => {
  return Inquirer.prompt({
    type: "list",
    name: "bundleType",
    message: "bundle Type?",
    choices: config.bundleType
  });
};

/**
 *
 * @returns {Promise<unknown>}
 */
const bundleScaffolder = () => {
  return new Promise(async resolve => {
    // get bundle type with prompt
    let bundleType = "";
    await askBundleType().then(resolve => (bundleType = resolve.bundleType));

    log("bundleType", bundleType);

    const skeletonsBundleDirPath = `${paths.skeletonsPath}/bundle/${bundleType}`;

    // skaffold bundle folder as src with the response
    if (bundleType === "dom") {
    }
    //
    if (bundleType === "react") {
    }

    //
  });
};

module.exports = bundleScaffolder;
