const { CLICommands } = require("@solid-js/cli")
const { Files } = require("@zouloux/files")
Files.setVerbose(false)

/**
 * Run tasks
 */
;(async function tasks() {
  CLICommands.add("dev", (options, args) => {
    require("./dev").dev()
  })
  CLICommands.add("build", (options, args) => {
    require("./build").build()
  })
  CLICommands.add("clean", (options, args) => {
    require("./clean").clean()
  })
  CLICommands.add("reset", (options, args) => {
    require("./reset").reset()
  })
  CLICommands.add("scaffold", (options, args) => {
    require("./scaffold").scaffold()
  })
  CLICommands.add("wp-scaffold", (options, args) => {
    require("./wp-scaffold").wpScaffold()
  })
  CLICommands.add("help", (options, args) => {
    require("./help").help()
  })
  CLICommands.add("setup", (options, args) => {
    require("./setup").setup()
  })

  await CLICommands.start()
})()
