require("colors");
const { execSync } = require("@solid-js/cli");

const logs = {
  /**
   * Start
   * @param pMessage
   * @param pClear
   */
  start: (pMessage = "", pClear = false) => {
    if (pClear) execSync("clear", 3);
    console.log(`➤  ${pMessage}`.brightBlue);
  },

  /**
   * Note
   * @param pMessage
   */
  note: (pMessage = "") => {
    console.log(`✔ ${pMessage}`.grey);
  },

  /**
   * Done
   * @param pMessage
   */
  done: (pMessage = "Done.") => {
    console.log(`✔ ${pMessage}`.green, "\n");
  },

  /**
   * Error
   * @param pMessage
   */
  error: (pMessage = "") => {
    console.log(`❌ ${pMessage}`.red, "\n");
  }
};

module.exports = { logs };
