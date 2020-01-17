const { logs } = require("../../helpers/logs-helper");
const { setupReadme } = require("./modules/setup-readme");
const { setupBundle } = require("./modules/setup-bundle");
const { checkConfigFile } = require("./modules/check-config-file");
const { setupPackageJson } = require("./modules/setup-package-json");
const { setupEnvFile } = require("./modules/setup-env-file");
const { cleanFrameworkFiles } = require("./modules/clean-framework-files");
const { showHelp } = require("./modules/show-help");
const { setupInstallConfig } = require("./modules/setup-install-config");
const { setupGitignore } = require("./modules/setup-gitignore");
const debug = require("debug")("config:setup");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// target local path files
const paths = require("./paths");
// get local task config
const config = require("./config");

// ----------------------------------------------------------------------------- FINAL

/**
 * Setup
 * TODO Add init back cockpit
 */
const setup = () => {
  return new Promise(async resolve => {
    // check if cache file exist, if exist, do not contiue
    if (!checkConfigFile()) return;
    // create bundle return bundle type
    const bundleType = await setupBundle({});
    // manage package json and get values
    const packageJsonValues = await setupPackageJson({});
    // manage readme
    await setupReadme({
      projectName: packageJsonValues.projectName,
      projectDescription: packageJsonValues.projectDescription,
      projectAuthor: packageJsonValues.projectAuthor
    });
    // setup .env
    await setupEnvFile({});
    // remove unused files and directories
    await cleanFrameworkFiles({});
    // create cache file if is the first install;
    await setupInstallConfig({ bundleType });
    // manage gitignore (add and remove values)
    await setupGitignore({});
    // show help
    await showHelp();
    // end
    resolve();

    logs.done("Webpack-base is ready!");
  });
};

// return
module.exports = { setup };
