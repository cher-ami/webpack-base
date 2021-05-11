require("colors")
const logs = require("../../helpers/logs-helper")
const { clean } = require("../clean")
const { prebuild } = require("../prebuild")

const _build = async () => {
  const webpack = require("webpack")
  const prodConfig = require("../../webpack/webpack.production")
  const compiler = webpack(prodConfig)

  logs.start("Start build")
  return new Promise((resolve, reject) => {
    // start webpack compiler
    compiler.run((err, stats) => {
      // if compiler error (err), or build error
      if (err || stats.hasErrors()) {
        logs.error("webpack build with error")
        reject(err)
      }

      stats.toJson("minimal")
      const log = stats.toString({
        chunks: false,
        all: false,
        assets: true,
        errors: true,
        warnings: true,
        colors: true,
        assetsSort: "size",
      })

      console.log(log)
      resolve(true)
    })
  })
}

/**
 * build task
 */
const build = async () => {
  clean()

  try {
    await prebuild()
    return await _build()
  } catch (e) {
    throw new Error("build task failed")
  }
}

module.exports = { build }
