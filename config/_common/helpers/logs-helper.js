const { execSync } = require("@solid-js/cli");

/**
 * error
 * @param message
 */
const logError = message => {
  console.log(`❌ ${message}`.red, "\n");
};

/**
 * start
 * @param message
 * @param clear
 */
const logStart = (message, clear = false) => {
  if (clear) execSync("clear", 3);
  console.log(`➤  ${message}`.brightBlue);
};

/**
 * done
 * @param message
 * @param resolve
 * @param delay
 */
const logDone = ({ message = "Done.", resolve, delay = 0 }) => {
  console.log(`✔ ${message}`.green, "\n");
  setTimeout(() => resolve && resolve(), delay);
};

module.exports = { logError, logStart, logDone };
