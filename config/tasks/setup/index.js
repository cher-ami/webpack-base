const { execSync, task, newLine } = require("@solid-js/cli");
const { setupReadme } = require("./modules/setup-readme");
const { setupBundle } = require("./modules/setup-bundle");
const { checkConfigFile } = require("./modules/check-config-file");
const { setupPackageJson } = require("./modules/setup-package-json");
const { cleanFrameworkFiles } = require("./modules/clean-framework-files");
const { showHelp } = require("./modules/show-help");
const { setupInstallConfig } = require("./modules/setup-install-config");
const { setupGitignore } = require("./modules/setup-gitignore");
const debug = require("debug")("config:setup");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// target local path files
const paths = require("../../global.paths");
// get local task config
const config = require("../../global.config");

// ----------------------------------------------------------------------------- TASK

const taskProgress = (task, taskNumber) => {
  execSync("clear", 3);
  newLine();
  task.progress(taskNumber, 7);
  newLine();
  newLine();
};

// ----------------------------------------------------------------------------- FINAL

/**
 * Setup
 */
const setup = () => {
  return new Promise(async resolve => {
    // check if cache file exist, if exist, do not contiue
    if (!checkConfigFile({})) return;

    const taskSetup = task("Setup");

    // create bundle return bundle type
    taskProgress(taskSetup, 1);
    const bundleType = await setupBundle({});

    // manage package json and get values
    taskProgress(taskSetup, 2);
    const packageJsonValues = await setupPackageJson({});

    // manage readme
    taskProgress(taskSetup, 3);
    await setupReadme({
      projectName: packageJsonValues.projectName,
      projectDescription: packageJsonValues.projectDescription,
      projectAuthor: packageJsonValues.projectAuthor
    });

    // remove unused files and directories
    taskProgress(taskSetup, 4);
    await cleanFrameworkFiles({});

    // create cache file if is the first install;
    taskProgress(taskSetup, 5);
    await setupInstallConfig({ bundleType });

    // manage gitignore (add and remove values)
    taskProgress(taskSetup, 6);
    await setupGitignore({});

    // show help
    taskProgress(taskSetup, 7);
    await showHelp();
    // end
    taskSetup.success("Webpack-base is ready!");
    newLine();
    resolve();
  });
};

// return
module.exports = { setup };
