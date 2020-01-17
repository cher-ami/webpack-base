const debug = require("debug")("config:setup");
const { Files } = require("@zouloux/files");
const { execSync } = require("@solid-js/cli");
const { help } = require("../help");
const { logs } = require("../../helpers/logs-helper");
const { manageReadme } = require("./modules/manage-readme");
const { setupBundle } = require("./modules/setup-bundle");
const { checkConfigFile } = require("./modules/check-config-file");
const { managePackageJson } = require("./modules/manage-package-json");
const { setupEnvFile } = require("./modules/setup-env-file");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// target local path files
const paths = require("./paths");
// get local task config
const config = require("./config");

// ----------------------------------------------------------------------------- TASKS

/**
 * remove Files and directories
 */
const _cleanFrameworkFiles = () => {
  return new Promise(async resolve => {
    logs.start("Remove .git folder... ", true);
    if (!config.fakeMode) await execSync("rm -rf .git", 3);
    logs.done();
    setTimeout(resolve, config.logDoneDelay);

    logs.start("Remove install.sh file... ", true);
    if (!config.fakeMode) await execSync("rm -rf install.sh", 3);
    logs.done();
    setTimeout(resolve, config.logDoneDelay);
  });
};

/**
 * Show help
 */
const _showHelp = () => {
  return new Promise(async resolve => {
    logs.start("Show help...", true);
    help();
    resolve();
  });
};

/**
 * Init Install config
 * @returns {Promise<unknown>}
 */
const _initInstallConfig = bundleType => {
  return new Promise(async resolve => {
    logs.start(`Create config file in ${paths.installConfig}...`, true);

    // init install config template
    const template = (pFileTabRegex = new RegExp(`\n(${"\t\t\t"})`, "gmi")) => {
      return `
			/**
			 * WARNING
			 * Auto-generated file, do not edit!
			 */
			exports.module = {
		  date: "${new Date()}",
      bundleType: "${bundleType}",
			};`.replace(pFileTabRegex, "\n");
    };

    // write file
    Files.new(paths.installConfig).write(template());
    logs.done();
    setTimeout(resolve, config.logDoneDelay);
  });
};

/**
 * Manage Gitignore
 * @returns {Promise<unknown>}
 */
const _manageGitignore = () => {
  return new Promise(resolve => {
    logs.start(`Manage .gitignore file...`, true);

    if (!config.fakeMode) {
      Files.getFiles(paths.gitignore).alter(fileContent => {
        return (
          fileContent
            // remove install.cache, we need to add it into git
            .replace(/config\/install.config.js/, `# config/install.config.js`)
        );
      });
    }

    logs.done();
    setTimeout(resolve, config.logDoneDelay);
  });
};

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
    const bundleType = await setupBundle();
    // manage package json
    await managePackageJson({});
    // manage readme // TODO pass package infos
    await manageReadme({});
    // setup .env
    await setupEnvFile({});
    // remove unused files and directories
    await _cleanFrameworkFiles();
    // create cache file if is the first install;
    await _initInstallConfig(bundleType);
    // manage gitignore (add and remove values)
    await _manageGitignore();
    // show help
    await _showHelp();
    // end
    resolve();

    logs.done("Webpack-base is ready!");
  });
};

// return
module.exports = { setup };
