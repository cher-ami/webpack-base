const { CLICommands } = require("@solid-js/cli");
const { Files } = require("@zouloux/files");
Files.setVerbose(false);

/**
 * Run tasks
 */
(async function tasks() {
  CLICommands.add("dev", (options) => {
    require("./dev").dev(options);
  });
  CLICommands.add("build", (options) => {
    require("./build").build(options);
  });
  CLICommands.add("clean", (options) => {
    require("./clean").clean(options);
  });
  CLICommands.add("reset", (options) => {
    require("./reset").reset(options);
  });
  CLICommands.add("scaffold", (options) => {
    require("./scaffold").scaffold(options);
  });
  CLICommands.add("help", (options) => {
    require("./help").help(options);
  });
  CLICommands.add("setup", (options) => {
    require("./setup").setup(options);
  });

  await CLICommands.start();
})();
