const root = require("app-root-path");

module.exports = {
  /**
   * root
   */
  root: root.resolve(""),
  readme: root.resolve("README.md"),
  gitignore: root.resolve(".gitignore"),
  nodeModules: root.resolve("node_modules"),
  envExample: root.resolve(".env.example"),
  env: root.resolve(".env"),
  packageJson: root.resolve("package.json"),
  gitFolder: root.resolve(".git"),
  installScript: root.resolve("install.sh"),

  /**
   * src
   */
  src: root.resolve("src"),
  fontsPath: root.resolve("src/fonts"),
  publicPath: root.resolve("src/public"),
  spritesTemplatesPath: root.resolve("config/tasks/sprites/templates"),
  spritesOutputPath: root.resolve("src/sprites"),
  atomsPath: root.resolve("src/atoms"),
  atomsPartialsPath: root.resolve("src/atoms/partials"),
  atomsFilesToWatch: root.resolve("src/atoms/partials/*.less"),
  atomsGeneratedFilename: "atoms.ts",

  /**
   * dist
   */
  dist: root.resolve("dist"),
  static: root.resolve("dist/static"),

  /**
   * config
   */
  config: root.resolve("config"),
  tasks: root.resolve("config/tasks"),
  taskSetupFolder: root.resolve("config/tasks/setup"),
  installConfig: root.resolve("config/install.config.js"),
  webpackTemplatePath: root.resolve("config/webpack/templates"),
  bundlesTemplatesPath: root.resolve("config/tasks/scaffold-bundle/templates"),
  componentsTemplatesPath: root.resolve(
    "config/tasks/scaffold-component/templates"
  ),
};
