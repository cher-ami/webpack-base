const prebuildHtaccess = require("./modules/prebuild-htaccess");

/**
 * Execute all prebuild modules
 */
const init = () => {
  // prebuild modules
  prebuildHtaccess();

  // add your modules here...
};

module.exports = init;
