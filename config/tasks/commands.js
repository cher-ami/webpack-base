const { commands } = require("@solid-js/cli");
const { clean } = require("./clean");
const { sprites } = require("./sprites");
const { dev } = require("./dev");
const { build } = require("./build");
const { reset } = require("./reset");
const { scaffold } = require("./scaffold");
const { help } = require("./help");
const { setup } = require("./setup");

const tasks = [
  "dev",
  "build",
  "clean",
  "sprites",
  "reset",
  "scaffold",
  "help",
  "setup",
];

// map all tasks and add commands
tasks.map((el) => {
  /**
   * options param is an object who contains string option
   * we set when we call script.
   * ex:
   * node script.js --env hello
   * options will be { env: hello }
   */
  commands.add(el, (options) => eval(el)(options));
});

// start command
commands.start((command) => {
  // ma each command
  tasks.map((el) => {
    /**
     * commands.run second arg {} is default options we have previously passed
     */
    if (command === el) commands.run(el, {});
  });
});
