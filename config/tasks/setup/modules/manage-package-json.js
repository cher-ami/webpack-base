const { Files } = require("@zouloux/files");
const Inquirer = require("inquirer");
const changeCase = require("change-case");
const { logs } = require("../../../helpers/logs-helper");
const debug = require("debug")("config:manage-package-json");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// target local path files
const paths = require("../paths");
// get local task config
const config = require("../config");

// ----------------------------------------------------------------------------- MODULE

/**
 * Setup package.json
 */
const managePackageJson = ({
  packageJson = require(paths.packageJson),
  logDoneDelay = config.logDoneDelay,
  defaultProjectName = "webpack-base"
}) => {
  return new Promise(async resolve => {
    logs.start("Setup package.json...", true);

    // Read package.json
    let projectName = packageJson.name;
    let projectVersion = packageJson.version;
    let projectAuthor = packageJson.author;
    let projectDescription = packageJson.description;

    debug("current package properties:", {
      projectName,
      projectVersion,
      projectAuthor,
      projectDescription
    });

    // Get package infos if this is the first setup
    if (projectName !== defaultProjectName) {
      debug(`package.json name, has NOT default name ${defaultProjectName}.
      Current package.json name is ${projectName}.
      We suppose he has been already setup.
      `);

      logs.error("package.json is already setup. Aborting.");
      return resolve(projectName, projectAuthor, projectDescription);
    }

    // Ask user for project name
    await Inquirer.prompt({
      type: "input",
      message: "What's the project name? (dash-case)",
      name: "projectName"
    }).then(answer => (projectName = changeCase.paramCase(answer.projectName)));

    debug("new projectName:", projectName);

    // Ask user for author
    await Inquirer.prompt({
      type: "input",
      message: "What's the author name?",
      name: "projectAuthor"
    }).then(answer => (projectAuthor = answer.projectAuthor));

    debug("new projectAuthor:", projectAuthor);

    // Ask user for desc
    await Inquirer.prompt({
      type: "input",
      message: "Descripton?",
      name: "projectDescription"
    }).then(answer => (projectAuthor = answer.projectDescription));

    debug("new projectDescription:", projectDescription);

    // Reset project version
    projectVersion = "0.1.0";

    debug("new projectVersion:", projectVersion);

    // Set name and version into package.json
    if (!config.fakeMode) {
      debug("Modify packageJson...");
      Files.getFiles(packageJson).alterJSON(packageObject => {
        packageObject.version = projectVersion;
        packageObject.name = projectName;
        packageObject.author = projectAuthor;
        packageObject.description = projectDescription;
        return packageObject;
      });
    } else {
      debug("FakeMode is activated, do nothing.".red);
    }

    logs.done();
    debug("Promise is resolve fn pass new package properties:", {
      projectName,
      projectAuthor,
      projectDescription
    });
    setTimeout(
      () => resolve(projectName, projectAuthor, projectDescription),
      logDoneDelay
    );
  });
};

module.exports = { managePackageJson };
