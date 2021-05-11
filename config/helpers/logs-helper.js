require("colors")

module.exports = {
  /**
   * Start
   * @param pMessage
   */
  start: (pMessage = "") => {
    console.log(`${pMessage}`.brightBlue)
  },

  /**
   * Note
   * @param pMessage
   */
  note: (pMessage = "") => {
    console.log(`> ${pMessage}`.grey)
  },

  /**
   * Done
   * @param pMessage
   */
  done: (pMessage = "Done.") => {
    console.log(`✔`.green, `${pMessage}`, "\n")
  },

  /**
   * Error
   * @param pMessage
   */
  error: (pMessage = "") => {
    console.log(`${pMessage}`.red, "\n")
  },
}
