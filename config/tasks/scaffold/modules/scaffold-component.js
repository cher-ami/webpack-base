require("colors");
const Inquirer = require("inquirer");
const changeCase = require("change-case");
const log = require("debug")("lib:scaffold-component");
const createFile = require("../helpers/create-file");
const config = require("../config");
const { logs } = require("../../../_common/helpers/logs-helper");

// ----------------------–----------------------–----------------------–-------- PRIVATE

const _askWhichComponentFolder = () => {
  return Inquirer.prompt({
    type: "list",
    name: "subFolder",
    message: "Which component folder?",
    choices: config.componentCompatibleFolders
  });
};

const _askComponentName = () => {
  return Inquirer.prompt({
    type: "input",
    message: "Component name?",
    name: "componentName"
  });
};

const _askConnectToStore = () => {
  return Inquirer.prompt({
    type: "confirm",
    message: "Connect component to store?",
    name: "connectToStore",
    default: false
  });
};

/**
 * React Component Builder
 * @param subFolder
 * @param connectToStore
 * @param upperComponentName
 * @param componentPath
 * @private
 */
const _reactComponentBuilder = ({
  subFolder,
  connectToStore,
  componentPath,
  upperComponentName
}) => {
  // choose between page and component type
  const componentType = subFolder === "pages" ? "page" : "component";
  // scaffold component file
  createFile({
    templateFilePath: `${config.templatesPath}/components/react/${componentType}.tsx.template`,
    destinationFilePath: `${componentPath}/${upperComponentName}.tsx`,
    replaceExpressions: { upperComponentName }
  });

  // index type depend of conect to store answer
  const indexType = `index${connectToStore ? "-redux" : ""}`;
  // scaffold index
  createFile({
    templateFilePath: `${config.templatesPath}/components/react/${indexType}.ts.template`,
    destinationFilePath: `${componentPath}/index.ts`,
    replaceExpressions: { upperComponentName }
  });

  // scaffold less module
  createFile({
    templateFilePath: `${config.templatesPath}/components/react/component.less.template`,
    destinationFilePath: `${componentPath}/${upperComponentName}.module.less`,
    replaceExpressions: { upperComponentName }
  });
};

/**
 * DOM Component builder
 * @param componentPath
 * @param upperComponentName
 * @private
 */
const _domComponentBuilder = ({ componentPath, upperComponentName }) => {
  // scaffold component file
  createFile({
    templateFilePath: `${config.templatesPath}/components/dom/component.ts.template`,
    destinationFilePath: `${componentPath}/${upperComponentName}.ts`,
    replaceExpressions: { upperComponentName }
  });
  // scaffold less module
  createFile({
    templateFilePath: `${config.templatesPath}/components/dom/component.less.template`,
    destinationFilePath: `${componentPath}/${upperComponentName}.less`,
    replaceExpressions: { upperComponentName }
  });
};

// ----------------------–----------------------–----------------------–-------- PUBLIC

/**
 * @name scaffoldComponent
 * @description Ask question and scaffold a component with a specific script template
 * @returns {Promise<any>}
 */
const scaffoldComponent = pComponentType => {
  return new Promise(async resolve => {
    /**
     * Ask questions
     */
    let subFolder = "";
    // Get sub-folder for components
    await _askWhichComponentFolder().then(answer => {
      subFolder = answer.subFolder;
    });

    // Get component name
    let componentName = "";
    await _askComponentName().then(answer => {
      componentName = answer.componentName;
    });

    // Get connect to store response
    let connectToStore = false;
    if (pComponentType === "react") {
      await _askConnectToStore().then(answer => {
        connectToStore = answer.connectToStore;
      });
    }

    // formated name "lowerCase"
    let lowerComponentName = changeCase.camelCase(componentName);
    // formated name "UpperCase"
    let upperComponentName = changeCase.pascalCase(componentName);

    // Base path of the component (no extension here)
    // TODO "src" need to get externalize
    let componentPath = `src/${subFolder}/${lowerComponentName}`;

    /**
     * Build component
     */

    // build REACT component
    if (pComponentType === "react") {
      _reactComponentBuilder({
        subFolder,
        connectToStore,
        upperComponentName,
        componentPath
      });
    }

    // build DOM component
    if (pComponentType === "dom") {
      _domComponentBuilder({
        upperComponentName,
        componentPath
      });
    }

    // final log
    logs.done("Component created.");
    resolve();
  });
};

/**
 * return scaffold component function
 */
module.exports = scaffoldComponent;
