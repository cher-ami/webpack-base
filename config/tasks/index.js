const CLI = require("@solid-js/cli");
const { clean } = require("./clean");
const { dev } = require("./dev");
const { build } = require("./build");
const { reset } = require("./reset");
const { scaffold } = require("./scaffold");
const { help } = require("./help");
const { setup } = require("./setup");

const tasksList = [
  "dev",
  "build",
  "clean",
  "reset",
  "scaffold",
  "help",
  "setup",
];

// map all tasks and add commands
tasksList.map((el) => {
  /**
   * options param is an object who contains string option
   * we set it when we call script.
   * ex:
   * node script.js --env hello
   * options will be { env: hello }
   */
  CLI.CLICommands.add(el, (options) => eval(el)(options));
});

// start command
CLI.CLICommands.start((command) => {
  // ma each command
  tasksList.map((el) => {
    // commands.run second arg {} is default options we have previously passed
    if (command === el) tasksList.run(el, {});
  });
});
