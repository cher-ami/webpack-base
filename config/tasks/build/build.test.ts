const paths = require("../../global.paths.js")
const { build } = require("./index")

jest.setTimeout(50000)

const env = Object.assign({}, process.env)

describe("task build", () => {
  // force current NODE_ENV, others env properties are getting from .env.test
  beforeEach(() => {
    process.env.NODE_ENV = "production"
  })

  afterEach(() => {
    process.env.NODE_ENV = env.NODE_ENV
  })

  console.log("process.env.NODE_ENV", process.env.NODE_ENV)

  it("should build without error", async () => {
    const buildTask = await build()
    await expect(buildTask).toBe(true)
  })
})
