const Inquirer = require("inquirer");
const { Files } = require("@zouloux/files");
const packageJson = require("../../package.json");
const { execSync, banner, print, task } = require("@solid-js/cli");
const paths = require("../paths");
const help = require("./help");
const changeCase = require("change-case");
require("colors");
const scaffoldBundle = require("../scaffolder/modules/scaffold-bundle");

// ----------------------------------------------------------------------------- LOG

const fakeMode = true;

// ----------------------------------------------------------------------------- LOG

// error
const logError = pMessage => console.log(`${pMessage}`.red, "\n");

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
      logError("> package.json is already setup. Aborting.");
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
      logError("> .env file already exists. Aborting.".red);
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

// ----------------------------------------------------------------------------- FINAL

/**
 * Setup Final
 */
const setup = () => {
  return new Promise(async resolve => {

    // bundle
    await _setupBundle();
    // package
    await _setupPackageJson();
    // env
    await setupEnvFile();
    // remove unused files and directories
    await removeUnused();
    // show help
    await showHelp();
    // end
    resolve();

    Files.new(`${paths.config}/install.cache`).write(`${new Date()}`);

    logDone({ message: "Webpack-base is ready!" });
  });
};

// return
module.exports = setup();
