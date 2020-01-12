const Inquirer = require("inquirer");
const path = require("path");
const paths = require("../paths");
const config = require("../config");
// Some colors in the terminal @see : https://github.com/marak/colors.js/
require("colors");
const log = require("debug")("lib:scaffold");

const scaffoldComponent = require("./modules/scaffold-component");
const bundleScaffolder = require("./modules/scaffold-bundle");

// ----------------------------------------------------------------------------- COMMON TASKS

/**
 * Ask bundle Type to
 */

const _scaffolders = [
  {
    name: "React component",
    exec: () => scaffoldComponent("react")
  },
  {
    name: "DOM component",
    exec: () => scaffoldComponent("dom")
  },
  {
    name: new Inquirer.Separator()
  },
  {
    name: "Bundle",
    exec: () => bundleScaffolder()
  }
];

// ----------------------------------------------------------------------------- PUBLIC API
const scaffold = () =>
  new Promise(resolve => {
    // Get scaffolder to present listing to user
    let scaffolderTypes = _scaffolders.map(scaffolder => scaffolder.name);

    // List available scaffolders to user
    Inquirer.prompt({
      type: "list",
      name: "type",
      message: "What kind of component to create?",
      choices: scaffolderTypes,
      pageSize: 20
    }).then(answer => {
      // Get scaffolder index
      const scaffolderIndex = scaffolderTypes.indexOf(answer.type);

      // Start this scaffolder
      _scaffolders[scaffolderIndex].exec();
    });
  });

module.exports = scaffold();
