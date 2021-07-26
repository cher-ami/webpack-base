require("colors")
const Inquirer = require("inquirer")
const wpScaffoldComponent = require("./component")
const logs = require("../../helpers/logs-helper")
const debug = require("debug")("config:scaffold")

// get local task path
const paths = require("../../global.paths")

/**
 * Ask bundle Type to
 */
const _scaffolders = [
  {
    name: "Post Type",
    exec: () => wpScaffoldComponent("postType"),
  },
  {
    name: "Page",
    exec: () => wpScaffoldComponent("page"),
  },
  {
    name: "Option Page",
    exec: () => wpScaffoldComponent("optionPage"),
  },
  {
    name: "Block",
    exec: () => wpScaffoldComponent("block"),
  },
]

const wpScaffold = () => {
  new Promise((resolve) => {
    // Get scaffolder to present listing to user
    let scaffolderTypes = _scaffolders.map((scaffolder) => scaffolder.name)

    if (!paths.wpTheme) {
      logs.error(`WP path not defined in global.paths`.bold)
      console.log(
        `Add \n\n ${
          `  /**\n    * wp\n    */\n   wpTemplatesPath: root.resolve("config/tasks/wp-scaffold/component/templates"), \n   wpTheme: root.resolve("dist/api/web/app/themes/CherAmi"),`
            .yellow.bold
        } \n\nto ${`global.paths.js`.bold}`
      )
      return
    }

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
}

module.exports = { wpScaffold }
