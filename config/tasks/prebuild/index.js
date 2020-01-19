const prebuildHtaccess = require("./modules/prebuild-htaccess");

/**
 * Execute all prebuild modules
 */
const prebuild = () =>
  new Promise(async resolve => {
    // prebuild modules
    // await prebuildHtaccess();
    // add your modules here...
    resolve();
  });

module.exports = { prebuild };
