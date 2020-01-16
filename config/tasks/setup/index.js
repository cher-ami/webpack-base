require("colors");
const Inquirer = require("inquirer");
const { Files } = require("@zouloux/files");
const packageJson = require("../../../package.json");
const { execSync } = require("@solid-js/cli");
const paths = require("../../paths");
const changeCase = require("change-case");
const scaffoldBundle = require("../scaffold/modules/scaffold-bundle");
const cacheInstallFilePath = `${paths.config}/install.cache`;
const { help } = require("../help");
const { logs } = require("../../_common/helpers/logs-helper");

// ----------------------------------------------------------------------------- FAKE MODE

// SECURITY: If you need to manage this script pass fakeMode to true
const fakeMode = true;

// ----------------------------------------------------------------------------- LOG

const logDoneDelay = 1500;

// ----------------------------------------------------------------------------- TASKS

const _setupBundle = async () => {
  return new Promise(async resolve => {
    logs.start("Setup bundle project type...", true);
    await scaffoldBundle(true);
    logs.done();
    setTimeout(resolve, logDoneDelay);
  });
};

/**
 * Setup package.json
 */
const _setupPackageJson = () => {
  return new Promise(async resolve => {
    logs.start("Setup package.json...", true);

    // Read package.json
    let projectName = packageJson.name;
    let projectVersion = packageJson.version;
    let projectAuthor = packageJson.author;
    let projectDescription = packageJson.description;

    // Get package infos if this is the first setup
    if (projectName !== "webpack-base") {
      logs.error("package.json is already setup. Aborting.");
      return resolve();
    }

    // Ask user for project name
    await Inquirer.prompt({
      type: "input",
      message: "What's the project name? (dash-case)",
      name: "projectName"
    }).then(answer => (projectName = changeCase.paramCase(answer.projectName)));

    // Ask user for author
    await Inquirer.prompt({
      type: "input",
      message: "What's the author name?",
      name: "projectAuthor"
    }).then(answer => (projectAuthor = answer.projectAuthor));

    // Ask user for desc
    await Inquirer.prompt({
      type: "input",
      message: "Descripton?",
      name: "projectDescription"
    }).then(answer => (projectAuthor = answer.projectDescription));

    // Reset project version
    projectVersion = "0.1.0";

    // Set name and version into package.json
    if (!fakeMode) {
      Files.getFiles("package.json").alterJSON(packageObject => {
        packageObject.version = projectVersion;
        packageObject.name = projectName;
        packageObject.author = projectAuthor;
        packageObject.description = projectDescription;
        return packageObject;
      });
    }

    logs.done();
    setTimeout(resolve, logDoneDelay);
  });
};

/**
 * Setup env file
 */
const _setupEnvFile = () => {
  return new Promise(async resolve => {
    logs.start("Setup .env file...", true);

    // check
    if (Files.getFiles(paths.env).files.length > 0) {
      logs.error(".env file already exists. Aborting.");
      setTimeout(() => resolve(), 1000);
      return;
    }
    // Create new .env file with .env.example template
    Files.new(paths.env).write(Files.getFiles(paths.envExample).read());

    logs.done();
    setTimeout(resolve, logDoneDelay);
  });
};

/**
 * remove Files and directories
 */
const _removeUnused = () => {
  return new Promise(async resolve => {
    logs.start("Remove .git folder... ", true);
    if (!fakeMode) await execSync("rm -rf .git", 3);
    logs.done();
    setTimeout(resolve, logDoneDelay);

    logs.start("Remove install.sh file... ", true);
    if (!fakeMode) await execSync("rm -rf install.sh", 3);
    logs.done();
    setTimeout(resolve, logDoneDelay);
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
 * Init Cache file
 * @returns {Promise<unknown>}
 */
const _initCacheInstall = () => {
  return new Promise(async resolve => {
    logs.start(`Create cache file in ${cacheInstallFilePath}...`, true);
    // write file
    Files.new(cacheInstallFilePath).write(`${new Date()}`);
    logs.done();
    setTimeout(resolve, logDoneDelay);
  });
};

/**
 * Manage Gitignore
 * @returns {Promise<unknown>}
 */
const _manageGitignore = () => {
  return new Promise(resolve => {
    logs.start(`Manage .gitignore file...`, true);

    if (!fakeMode) {
      Files.getFiles(`${paths.root}/.gitignore`).alter(fileContent => {
        return (
          fileContent
            // remove install.cache, we need to add it into git
            .replace(/config\/install.cache/, "# config/install.cache")
        );
      });
    }

    logs.done();
    setTimeout(resolve, logDoneDelay);
  });
};

/**
 * Check if install file cache exist
 * @returns boolean
 */
const _checkCacheFile = () => {
  if (Files.getFiles(cacheInstallFilePath).files.length > 0) {
    execSync("clear", 3);
    logs.error(
      "install.cache file exist, first install as already been setup, Aborting."
    );
    console.log(`If you want to setup this project again like the first time you installed webpack-base, you need to: \n
  - remove ${cacheInstallFilePath} file
  - npm run setup
  \n
  ${"WARNING!".red.bold}\n
  ${"npm run setup".bold} erase a part of source project:\n
  - setup bundle: erase every files in src/ folder except common/ folder
  - setup package.json: erase name, description, author & version keys
  - ${".git will be removed!".bold}    
      `);
    return false;
  } else return true;
};

// ----------------------------------------------------------------------------- FINAL

/**
 * Setup
 * TODO Add init back cockpit
 * TODO install react, depend of with bundle type
 */
const setup = () => {
  return new Promise(async resolve => {
    // check if cache file exist, if exist, do not contiue
    if (!_checkCacheFile()) return;
    // bundle
    await _setupBundle();
    // package
    await _setupPackageJson();
    // env
    await _setupEnvFile();
    // remove unused files and directories
    await _removeUnused();
    // create cache file if is the first install;
    await _initCacheInstall();
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
