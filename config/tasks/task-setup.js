const Inquirer = require("inquirer");
const { Files } = require("@zouloux/files");
const packageJson = require("../../package.json");
const { execSync } = require("@solid-js/cli");
const paths = require("../paths");
const changeCase = require("change-case");
require("colors");

// ----------------------------------------------------------------------------- LOG

const logDone = () => console.log("> Done.".green, "\n");
const logError = pMessage => console.log(`${pMessage}`.red.bold, "\n");

// ----------------------------------------------------------------------------- TASKS

/**
 * Setup package.json
 */
const setupPackage = () => {
  return new Promise(async resolve => {
    console.log("> Setup package.json...");

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
      message: "Project name for package.json ? (dash-case)",
      name: "projectName"
    }).then(answer => (projectName = answer.projectName));

    // Ask user for author
    await Inquirer.prompt({
      type: "input",
      message: "Author name ?",
      name: "projectAuthor"
    }).then(answer => (projectAuthor = answer.projectAuthor));

    // Ask user for desc
    await Inquirer.prompt({
      type: "input",
      message: "Descripton ?",
      name: "projectDescription"
    }).then(answer => (projectAuthor = answer.projectDescription));

    // Reset project version
    projectVersion = "0.1.0";

    // Set name and version into package.json
    Files.getFiles("package.json").alterJSON(packageObject => {
      packageObject.version = projectVersion;
      packageObject.name = projectName;
      packageObject.author = projectAuthor;
      packageObject.description = projectDescription;
      return packageObject;
    });

    logDone();
    resolve();
  });
};

/**
 * Setup dependencies
 */
const setupDependencies = async () => {
  console.log("> Install dependencies...");
  execSync("npm i", 3);
  logDone();
};

/**
 * Setup env file
 */
const setupEnvFile = () => {
  console.log("> Setup .env file...");
  // check
  if (Files.getFiles(paths.env).files.length > 0) {
    logError("> .env file already exists. Aborting.");
    return;
  }
  // Create new .env file with .env.example template
  Files.new(paths.env).write(Files.getFiles(paths.envExample).read());
  logDone();
};

// ----------------------------------------------------------------------------- FINAL

/**
 * Setup Final
 * @returns {Promise<unknown>}
 */
const setup = () => {
  return new Promise(async resolve => {
    await setupPackage();
    await setupEnvFile();
    await setupDependencies();
    resolve();
  });
};

// return
module.exports = setup();
