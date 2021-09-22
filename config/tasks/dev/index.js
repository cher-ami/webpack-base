require("colors")
const { clean } = require("../clean")
const { prebuild } = require("../prebuild")
const paths = require("../../global.paths")

const TASK_DEV = "task-dev"
const debug = require("debug")(`config:${TASK_DEV}`)

/**
 * Start webpack dev server
 * @returns {Promise<void>}
 * @private
 */
const _startDevServer = async (closeServerAfterFirstBuild = false) => {
  const DEV_SERVER_OPEN = process.env.DEV_SERVER_OPEN === "true"
  const ENABLE_DEV_PROXY = process.env.ENABLE_DEV_PROXY === "true"
  const webpack = require("webpack")
  const webpackDevServer = require("webpack-dev-server")
  const webpackConfig = require("../../webpack/webpack.development.js")
  const ip = require("internal-ip")
  const portFinderSync = require("portfinder-sync")
  const compiler = webpack(webpackConfig)

  const devServerOptions = {
    port: process.env.DEV_SERVER_PORT || portFinderSync.getPort(3000),
    allowedHosts: "all",
    compress: true,
    https: false,
    historyApiFallback: true,
    open: DEV_SERVER_OPEN,
    devMiddleware: {
      index: true,
      serverSideRender: true,
      writeToDisk: true,
      stats: {
        preset: "minimal",
        colors: true,
      },
    },
    client: {
      logging: "info",
      overlay: true,
      progress: true,
    },
    // specify to enable root proxying
    // if use proxy option is enable
    ...(ENABLE_DEV_PROXY
      ? {
          proxy: {
            "/": {
              // target url like http://localhost/project/dist/base-path/
              target: process.env.PROXY_URL,
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : {}),
  }

  // create new dev server
  const server = new webpackDevServer(devServerOptions, compiler)

  // template logs to print on each build
  const templatingLogs = (port = devServerOptions.port) => {
    const https = server.options.https ? "s" : ""
    const localIp = ip.v4.sync()
    const localDomain = `http${https}://localhost:${port}`
    const networkDomain = `http${https}://${localIp}:${port}`
    const projectName = require("../../../package.json").name
    const template = [
      ``,
      `${`✔ Serving!`.bold}`,
      ``,
      `- ${`Project:`.grey}   ${projectName}`,
      `- ${`Local:`.grey}     ${localDomain.brightBlue}`,
      `- ${`Network:`.grey}   ${networkDomain.brightBlue}`,
      ``,
    ].join(`\n`)

    const clearConsoleAndLog = (logs = template) => {
      const clear = "\x1B[2J\x1B[3J\x1B[H"
      const output = logs ? `${clear + logs}\n\n` : clear
      process.stdout.write(output)
    }
    clearConsoleAndLog()
  }

  return new Promise((resolve, reject) => {
    // start to listen
    server.start(devServerOptions.port)

    compiler.hooks.done.tap(TASK_DEV, (stats) => {
      const hasErrors = stats && stats.hasErrors()
      const hasWarnings = stats && stats.hasWarnings()

      debug({ hasErrors, hasWarnings })

      if (hasErrors) {
        debug("error !".bgRed)
        if (closeServerAfterFirstBuild) server.close()
        reject()
        return
      }

      templatingLogs()
      debug("success !".bgGreen.black)
      if (closeServerAfterFirstBuild) server.close()
      resolve(true)
    })
  })
}

module.exports = {
  dev: async (closeServerAfterFirstBuild = false) => {
    clean()
    await prebuild()
    try {
      return await _startDevServer(closeServerAfterFirstBuild)
    } catch (e) {
      throw new Error("dev task failed")
    }
  },
}
