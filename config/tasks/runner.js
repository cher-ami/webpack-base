const CLI = require("@solid-js/cli");

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
    console.log('CLICommands error', e);
  }

})();
