const appRoot = require("app-root-path");

module.exports = {
  root: appRoot.resolve(""),
  readme: appRoot.resolve("README.md"),
  gitignore: appRoot.resolve(".gitignore"),
  nodeModules: appRoot.resolve("node_modules"),
  envExample: appRoot.resolve(".env.example"),
  env: appRoot.resolve(".env"),
  packageJson: appRoot.resolve("package.json"),
  gitFolder: appRoot.resolve(".git"),
  installScript: appRoot.resolve("install.sh"),

  src: appRoot.resolve("src"),
  fontsPath: appRoot.resolve("src/fonts"),
  publicPath: appRoot.resolve("src/public"),
  spritesTemplatesPath: appRoot.resolve("config/tasks/sprites/templates"),
  spritesOutputPath: appRoot.resolve("src/sprites"),

  /**
   * These are used by custom less-to-js-webpack-plugin
   */
  atomsPath: appRoot.resolve("src/atoms"),
  atomsPartialsPath: appRoot.resolve("src/atoms/partials"),
  atomsFilesToWatch: appRoot.resolve("src/atoms/partials/*.less"),
  atomsGeneratedFilename: "atoms.ts",

  dist: appRoot.resolve("dist"),
  static: appRoot.resolve("dist/static"),
  config: appRoot.resolve("config"),
  tasks: appRoot.resolve("config/tasks"),
  taskSetupFolder: appRoot.resolve("config/tasks/setup"),
  installConfig: appRoot.resolve("config/install.config.js"),
  webpackTemplatePath: appRoot.resolve("config/webpack/templates"),
  bundlesTemplatesPath: appRoot.resolve(
    "config/tasks/scaffold-bundle/templates"
  ),
  componentsTemplatesPath: appRoot.resolve(
    "config/tasks/scaffold-component/templates"
  ),
};
