const paths = require("../../global.paths.js");
const build = require("./index");

jest.setTimeout(50000);
it("should build without error", async () => {
  const buildTask = await build();
  await expect(buildTask).toBe(true);
});
