const { dev } = require("./index")

jest.setTimeout(50000)

const env = Object.assign({}, process.env)

describe("task dev", () => {
  // force current NODE_ENV, others env properties are getting from .env.test
  beforeEach(() => {
    process.env.NODE_ENV = "development"
  })

  afterEach(() => {
    process.env.NODE_ENV = env.NODE_ENV
  })

  console.log("process.env.NODE_ENV", process.env.NODE_ENV)

  it("should dev without error", async () => {
    const devTask = await dev(true)
    await expect(devTask).toBe(true)
  })
})
