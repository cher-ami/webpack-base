const CLI = require("@solid-js/cli");
const logs = require("../helpers/logs-helper");

// prettier-ignore
(async function tasks() {
  // list require tasks
  const tasksList = {
    dev: require('./dev'),
    build: require('./build'),
    clean: require('./clean'),
    reset: require('./reset'),
    scaffold: require('./scaffold'),
    help: require('./help'),
    setup: require('./setup'),
  };

  Object.keys(tasksList).forEach((task) => {
    CLI.CLICommands.add(task, (options) => {
      tasksList[task](options);
    });
  });

  try {
    await CLI.CLICommands.start();
  } catch (e) {
    logs.error('CLICommands error', e);
  }

})();
