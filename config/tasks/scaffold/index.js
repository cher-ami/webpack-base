require("colors");
const Inquirer = require("inquirer");
const debug = require("debug")("config:scaffold");

// ----------------------------------------------------------------------------- COMMON TASKS

const scaffoldComponent = require("./modules/scaffold-component");
const scaffoldBundle = require("./modules/scaffold-bundle");

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
  }
  // {
  //   name: new Inquirer.Separator()
  // },
  // {
  //   name: "Bundle",
  //   exec: () => scaffoldBundle()
  // }
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

    resolve();
  });

module.exports = { scaffold };
