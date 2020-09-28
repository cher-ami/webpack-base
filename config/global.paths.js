const appRoot = require("app-root-path");

module.exports = {
  // --------------------------------------------------------------------------- ROOT

  // root folder
  root: appRoot.resolve(""),
  // readme file
  readme: appRoot.resolve("README.md"),
  // .gitignore file
  gitignore: appRoot.resolve(".gitignore"),
  // node modules
  nodeModules: appRoot.resolve("node_modules"),
  // .env example file
  envExample: appRoot.resolve(".env.example"),
  // .env file
  env: appRoot.resolve(".env"),
  // package.json
  packageJson: appRoot.resolve("package.json"),
  // .git
  gitFolder: appRoot.resolve(".git"),
  // install.sh
  installScript: appRoot.resolve("install.sh"),

  // --------------------------------------------------------------------------- SRC

  // src folder
  src: appRoot.resolve("src"),

  // Path to fonts folder from src
  fontsPath: appRoot.resolve("src/fonts"),

  // Path to public folder used by copy-webpack-plugin
  publicPath: appRoot.resolve("src/public"),

  // --------------------------------------------------------------------------- SPRITES

  // Templates path
  spritesTemplatesPath: appRoot.resolve("config/tasks/sprites/templates"),
  // Sprite path
  spritesOutputPath: appRoot.resolve("src/sprites"),

  // --------------------------------------------------------------------------- ATOMS

  /**
   * These are used by custom less-to-js-webpack-plugin
   */
  // atoms path
  atomsPath: appRoot.resolve("src/atoms"),
  // atoms partial path
  atomsPartialsPath: appRoot.resolve("src/atoms/partials"),
  // atoms files to watch: can be glob
  atomsFilesToWatch: appRoot.resolve("src/atoms/partials/*.less"),
  // auto generated atoms file name
  atomsGeneratedFilename: "atoms.ts",

  // --------------------------------------------------------------------------- DIST

  // dist folder
  dist: appRoot.resolve("dist"),
  // static folder
  static: appRoot.resolve("dist/static"),

  // --------------------------------------------------------------------------- CONFIG

  // config folder
  config: appRoot.resolve("config"),
  // tasks
  tasks: appRoot.resolve("config/tasks"),
  // task setup folder
  taskSetupFolder: appRoot.resolve("config/tasks/setup"),
  // install config
  installConfig: appRoot.resolve("config/install.config.js"),
  // webpack template - move ?
  webpackTemplatePath: appRoot.resolve("config/webpack/templates"),
  // bundles templates path
  bundlesTemplatesPath: appRoot.resolve(
    "config/tasks/scaffold-bundle/templates"
  ),
  // components templates path
  componentsTemplatesPath: appRoot.resolve(
    "config/tasks/scaffold-component/templates"
  ),
};
