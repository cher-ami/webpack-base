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
  "setup"
];

// add commands
tasks.map(el => {
  commands.add(el, async () => eval(el)());
});

// start
commands.start(command => {
  tasks.map(el => {
    if (command === el) commands.run(el, {});
  });
});
