const config = require("../global.config")

// To not following to desactivate tasks fakeMode before merge branch
it("fakeMode should be false", () => {
  expect(config.fakeMode).toBe(false)
})
