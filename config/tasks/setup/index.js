require("colors");
const Inquirer = require("inquirer");
const debug = require("debug")("config:setup");
const { Files } = require("@zouloux/files");
const packageJson = require("../../../package.json");
const { execSync } = require("@solid-js/cli");
const changeCase = require("change-case");
const scaffoldBundle = require("../scaffold/modules/scaffold-bundle");
const { help } = require("../help");
const { logs } = require("../../helpers/logs-helper");
const { manageReadme } = require("./modules/manage-readme");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// target local path files
const paths = require("./paths");
// get local task config
const config = require("./config");

// ----------------------------------------------------------------------------- TASKS

const _setupBundle = async () => {
  return new Promise(async resolve => {
    logs.start("Setup bundle project type...", true);
    const bundleType = await scaffoldBundle(true);
    logs.done();
    setTimeout(() => resolve(bundleType), config.logDoneDelay);
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
    if (!config.fakeMode) {
      Files.getFiles("package.json").alterJSON(packageObject => {
        packageObject.version = projectVersion;
        packageObject.name = projectName;
        packageObject.author = projectAuthor;
        packageObject.description = projectDescription;
        return packageObject;
      });
    }

    logs.done();
    setTimeout(resolve, config.logDoneDelay);
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
    setTimeout(resolve, config.logDoneDelay);
  });
};

/**
 * remove Files and directories
 */
const _removeUnused = () => {
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

/**
 * Check if install file cache exist
 * @returns boolean
 */
const _checkConfigFile = () => {
  if (Files.getFiles(paths.installConfig).files.length > 0) {
    execSync("clear", 3);
    logs.error("install.config.js already file exist, Aborting.");
    console.log(`If you want to setup this project again like the first time you installed webpack-base, you need to: \n
  - remove ${paths.installConfig} file
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
 */
const setup = () => {
  return new Promise(async resolve => {
    // check if cache file exist, if exist, do not contiue
    if (!_checkConfigFile()) return;
    // create bundle return bundle type
    const bundleType = await _setupBundle();
    // package
    await _setupPackageJson();
    // manage readme // TODO pass package infos
    await manageReadme({});
    // env
    await _setupEnvFile();
    // remove unused files and directories
    await _removeUnused();
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
