const { setupReadme } = require("./modules/setup-readme");
const { checkConfigFile } = require("./modules/check-config-file");
const { setupPackageJson } = require("./modules/setup-package-json");
const { cleanFrameworkFiles } = require("./modules/clean-framework-files");
const { showHelp } = require("./modules/show-help");
const { setupInstallConfig } = require("./modules/setup-install-config");
const { setupGitignore } = require("./modules/setup-gitignore");
const { logs } = require("../../helpers/logs-helper");
const debug = require("debug")("config:setup");

const paths = require("../../global.paths");
const config = require("../../global.config");

/**
 * Setup
 */
const setup = () => {
  return new Promise(async (resolve) => {
    // check if cache file exist, if exist, do not continue
    if (!checkConfigFile()) return;

    // manage package json and get values
    const packageJsonValues = await setupPackageJson();

    // manage readme
    await setupReadme({
      projectName: packageJsonValues.projectName,
      projectDescription: packageJsonValues.projectDescription,
      projectAuthor: packageJsonValues.projectAuthor,
    });

    // remove unused files and directories
    await cleanFrameworkFiles();

    // create cache file if is the first install;
    await setupInstallConfig();

    // manage gitignore (add and remove values)
    await setupGitignore();

    // show help
    await showHelp();

    logs.done("Webpack-base is ready!");
    resolve();
  });
};

// return
module.exports = { setup };
