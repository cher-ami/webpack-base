require("colors");
const { clean } = require("../clean");
const { prebuild } = require("../prebuild");
const paths = require("../../global.paths");
require("colors");

/**
 * Start webpack dev server
 * @returns {Promise<void>}
 * @private
 */
const _startDevServer = async () => {
  const webpack = require("webpack");
  const webpackDevServer = require("webpack-dev-server");
  const webpackConfig = require("../../webpack/webpack.development.js");
  const compiler = webpack(webpackConfig);

  const ip = require("internal-ip");
  const portFinderSync = require("portfinder-sync");

  const DEV_SERVER_OPEN = process.env.DEV_SERVER_OPEN === "true";
  const DEV_SERVER_HOT_RELOAD = process.env.DEV_SERVER_HOT_RELOAD === "true";
  const ENABLE_DEV_PROXY = process.env.ENABLE_DEV_PROXY === "true";

  const devServerOptions = {
    publicPath: "",
    contentBase: paths.dist,
    host: "0.0.0.0",
    disableHostCheck: true,
    useLocalIp: true,
    inline: true,
    compress: true,
    https: false,
    historyApiFallback: true,

    hot: DEV_SERVER_HOT_RELOAD,
    open: DEV_SERVER_OPEN,
    writeToDisk: true,

    noInfo: false,
    stats: {
      preset: "minimal",
      colors: true,
    },
    quiet: false,

    // specify to enable root proxying
    // if use proxy option is enable
    index: "",
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
  };


  // create new dev server
  const server = new webpackDevServer(compiler, devServerOptions);

  // prepare dev server specs
  const port = process.env.DEV_SERVER_PORT || portFinderSync.getPort(3000);
  const localIp = ip.v4.sync();

  // template logs to print on each build
  const templatingLogs = () => {
    const https = server.options.https ? "s" : "";
    const localIp = ip.v4.sync();
    const localDomain = `http${https}://localhost:${port}`;
    const networkDomain = `http${https}://${localIp}:${port}`;
    const projectName = require("../../../package.json").name;
    const template = [
      ``,
      `${`✔ Serving!`.bold}`,
      ``,
      `- ${`Project:`.grey}   ${projectName}`,
      `- ${`Local:`.grey}     ${localDomain.brightBlue}`,
      `- ${`Network:`.grey}   ${networkDomain.brightBlue}`,
      ``,
    ].join(`\n`);

    const clearConsole = (logs = template) => {
      const clear = "\x1B[2J\x1B[3J\x1B[H";
      const output = logs ? `${clear + logs}\n\n` : clear;
      process.stdout.write(output);
    };
    clearConsole();
    // console.log(template);
  };

  
  return new Promise((resolve, reject) => {
    // start to listen
    server.listen(port, localIp);

    // On each watch
    compiler.hooks.watchRun.tap("coucou", (compilation) => {
      console.log(">>>>> hooks.watchRun".green);
      resolve(true);
      templatingLogs();
    });

    //  On failed /// Doesn't work
    compiler.hooks.failed.tap("coucou", (compilation) => {
      console.log(">>>>> hooks.failed".green);
      reject();
    });
  });
};

module.exports = {
  dev: async (_) => {
    clean();
    await prebuild();
    try {
      return await _startDevServer();
    } catch (e) {
      throw new Error("dev task failed");
    }
  },
};
