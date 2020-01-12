const Inquirer = require("inquirer");
const { Files } = require("@zouloux/files");
const packageJson = require("../../package.json");
const { execSync } = require("@solid-js/cli");
const paths = require("../paths");
const help = require("./help");
const changeCase = require("change-case");
require("colors");
const scaffoldBundle = require("../scaffolder/modules/scaffold-bundle");
const cacheInstallFilePath = `${paths.config}/install.cache`;

// ----------------------------------------------------------------------------- FAKE MODE

// If you need to manage this script pass fakeMode to true
const fakeMode = false;

// ----------------------------------------------------------------------------- LOG

// error
const logError = message => {
  console.log(`❌ ${message}`.red, "\n");
};

// start
const logStart = (message, clear = true) => {
  if (clear) execSync("clear", 3);
  console.log(`\n➤  ${message}`.bold.yellow, "\n");
};

// done
const logDone = ({ message = "Done.", resolve }) => {
  console.log(`✔ ${message}`.green, "\n");
  setTimeout(() => resolve && resolve(), 1500);
};

// ----------------------------------------------------------------------------- TASKS

const _setupBundle = async () => {
  return new Promise(async resolve => {
    logStart("Setup Bundle project Type...");

    // start scaffold
    await scaffoldBundle(true);
    logDone({ resolve });
  });
};

/**
 * Setup package.json
 */
const _setupPackageJson = () => {
  return new Promise(async resolve => {
    logStart("Setup package.json...");

    // Read package.json
    let projectName = packageJson.name;
    let projectVersion = packageJson.version;
    let projectAuthor = packageJson.author;
    let projectDescription = packageJson.description;

    // Get package infos if this is the first setup
    if (projectName !== "webpack-base") {
      logError("package.json is already setup. Aborting.");
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

    logDone({ resolve });
  });
};

/**
 * Setup env file
 */
const setupEnvFile = () => {
  return new Promise(async resolve => {
    logStart("Setup .env file...");

    // check
    if (Files.getFiles(paths.env).files.length > 0) {
      logError(".env file already exists. Aborting.".red);
      setTimeout(() => resolve(), 1000);
      return;
    }
    // Create new .env file with .env.example template
    Files.new(paths.env).write(Files.getFiles(paths.envExample).read());

    logDone({ resolve });
  });
};

/**
 * remove Files and directories
 */
const removeUnused = () => {
  return new Promise(async resolve => {
    logStart("Remove .git folder... ");
    if (!fakeMode) await execSync("rm -rf .git", 3);
    logDone({ resolve });

    logStart("Remove install.sh file... ");
    if (!fakeMode) await execSync("rm -rf install.sh", 3);
    logDone({ resolve });
  });
};

/**
 * Show help
 */
const showHelp = () => {
  return new Promise(async resolve => {
    logStart("Show help...");
    help();
    resolve();
  });
};

/**
 * Init Cache file
 * @returns {Promise<unknown>}
 */
const initCacheInstall = () => {
  return new Promise(async resolve => {
    logStart(`Create cache file in ${cacheInstallFilePath}...`);
    // write file
    Files.new(cacheInstallFilePath).write(`${new Date()}`);
    logDone({ resolve });
  });
};

// ----------------------------------------------------------------------------- FINAL

/**
 * Setup
 * TODO Add init back cockpit
 * TODO install react, depend of with bundle type
 */
const setup = () => {
  return new Promise(async resolve => {
    logStart(`Check if cache install file exist...`);
    if (Files.getFiles(cacheInstallFilePath).files.length > 0) {
      logError(
        "install.cache file exist, first install as already been setup, Aborting."
      );
      console.log(`
      If you want to setup this project again like the first time you installed webpack-base, you need to: \n
      - remove ${cacheInstallFilePath} file
      - npm run setup
      \n
      ${"WARNING!".red.bold}\n
      ${"npm run setup".bold} erase a part of source project: \n
      - setup bundle: erase every files in src/ folder except common/ folder
      - setup package.json: erase name, description, author & version keys
      - ${".git will be removed!".bold}    
      `);
      return;
    }

    // bundle
    await _setupBundle();
    // package
    await _setupPackageJson();
    // env
    await setupEnvFile();
    // remove unused files and directories
    await removeUnused();
    // create cache file if is the first install;
    await initCacheInstall();
    // show help
    await showHelp();
    // end
    resolve();

    logDone({ message: "Webpack-base is ready!" });
  });
};

// return
module.exports = setup();
