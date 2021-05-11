require("colors")
const Inquirer = require("inquirer")
const scaffoldComponent = require("./component")
const debug = require("debug")("config:scaffold")

/**
 * Ask bundle Type to
 */
const _scaffolders = [
  {
    name: "React component",
    exec: () => scaffoldComponent("react"),
  },
  {
    name: "DOM component",
    exec: () => scaffoldComponent("dom"),
  },
]

const scaffold = () =>
  new Promise((resolve) => {
    // Get scaffolder to present listing to user
    let scaffolderTypes = _scaffolders.map((scaffolder) => scaffolder.name)

    // List available scaffolders to user
    Inquirer.prompt({
      type: "list",
      name: "type",
      message: "What kind of component to create?",
      choices: scaffolderTypes,
      pageSize: 20,
    }).then((answer) => {
      // Get scaffolder index
      const scaffolderIndex = scaffolderTypes.indexOf(answer.type)

      // Start this scaffolder
      _scaffolders[scaffolderIndex].exec()
      resolve()
    })
  })

module.exports = { scaffold }
