require("colors")
const path = require("path")
const Inquirer = require("inquirer")
const changeCase = require("change-case")
const createFile = require("../../../helpers/create-file")
const logs = require("../../../helpers/logs-helper")
const { Files } = require("@zouloux/files")
const debug = require("debug")("config:scaffold-component")

// remove Files lib logs
Files.setVerbose(false)

const paths = require("../../../global.paths")
const config = require("../../../global.config")

const _askWhichComponentFolder = (
  componentCompatibleFolders = config.componentCompatibleFolders
) => {
  return Inquirer.prompt({
    type: "list",
    name: "subFolder",
    message: "Which component folder?",
    choices: componentCompatibleFolders,
  })
}

const _askComponentName = () => {
  return Inquirer.prompt({
    type: "input",
    message: "Component name?",
    name: "componentName",
  })
}

const _askTest = () => {
  return Inquirer.prompt({
    type: "confirm",
    message: "Create test file?",
    name: "createTest",
    default: false,
  })
}

/**
 * React Component Builder
 * @param subFolder
 * @param upperComponentName
 * @param componentPath
 * @param createTest
 * @private
 */
const _reactComponentBuilder = ({
  subFolder,
  componentPath,
  upperComponentName,
  createTest,
}) => {
  // choose between page and component type
  const componentType = subFolder === "pages" ? "page" : "component"
  // scaffold component file
  createFile({
    templateFilePath: `${paths.componentsTemplatesPath}/react/${componentType}.tsx.template`,
    destinationFilePath: `${componentPath}/${upperComponentName}.tsx`,
    replaceExpressions: { upperComponentName },
  })
  // scaffold less module
  createFile({
    templateFilePath: `${paths.componentsTemplatesPath}/react/component.less.template`,
    destinationFilePath: `${componentPath}/${upperComponentName}.module.less`,
    replaceExpressions: { upperComponentName },
  })

  // scaffold test
  if (createTest) {
    createFile({
      templateFilePath: `${paths.componentsTemplatesPath}/common/component.test.ts.template`,
      destinationFilePath: `${componentPath}/${upperComponentName}.test.ts`,
      replaceExpressions: { upperComponentName },
    })
  }
}

/**
 * DOM Component builder
 * @param componentPath
 * @param upperComponentName
 * @param createTest
 * @private
 */
const _domComponentBuilder = ({ componentPath, upperComponentName, createTest }) => {
  // scaffold component file
  createFile({
    templateFilePath: `${paths.componentsTemplatesPath}/dom/component.ts.template`,
    destinationFilePath: `${componentPath}/${upperComponentName}.ts`,
    replaceExpressions: { upperComponentName },
  })
  // scaffold less module
  createFile({
    templateFilePath: `${paths.componentsTemplatesPath}/dom/component.less.template`,
    destinationFilePath: `${componentPath}/${upperComponentName}.less`,
    replaceExpressions: { upperComponentName },
  })
  // scaffold test
  if (createTest) {
    createFile({
      templateFilePath: `${paths.componentsTemplatesPath}/common/component.test.ts.template`,
      destinationFilePath: `${componentPath}/${upperComponentName}.test.ts`,
      replaceExpressions: { upperComponentName },
    })
  }
}

// ----------------------–----------------------–----------------------–-------- PUBLIC

/**
 * @name index
 * @description Ask question and scaffold a component with a specific script template
 * @returns {Promise<any>}
 */
const scaffoldComponent = (pComponentType) => {
  return new Promise(async (resolve) => {
    // prepare

    const bundleFolderList = Files.getFolders(`${paths.src}/*`).files
    debug("bundleFolderList", bundleFolderList)

    // remove common from bundle list
    const filterBundleFolderList =
      // in bundle list folder
      bundleFolderList
        // do not keep common folder
        .filter((el) => el !== `${paths.src}/common`)
        // keep only end of path
        .map((el) => path.basename(el))

    debug("filterBundleFolderList", filterBundleFolderList)

    /**
     * Ask questions
     */

    let subFolder = ""
    // Get sub-folder
    await _askWhichComponentFolder().then((answer) => {
      subFolder = answer.subFolder
    })
    debug("subFolder", subFolder)

    // Get component name
    let componentName = ""
    await _askComponentName().then((answer) => {
      componentName = answer.componentName
    })

    // Get component name
    let createTest = ""
    await _askTest().then((answer) => {
      createTest = answer.createTest
    })

    // formated name "lowerCase"
    let lowerComponentName = changeCase.camelCase(componentName)

    // formated name "UpperCase"
    let upperComponentName = changeCase.pascalCase(componentName)
    debug("upperComponentName", upperComponentName)

    // Base path of the component (no extension at the end here)
    let componentPath = `${paths.src}/${subFolder}/${lowerComponentName}`
    debug("component will be created here: componentPath", componentPath)

    // build REACT component
    if (pComponentType === "react") {
      _reactComponentBuilder({
        subFolder,
        upperComponentName,
        componentPath,
        createTest,
      })
    }

    // build DOM component
    if (pComponentType === "dom") {
      _domComponentBuilder({
        upperComponentName,
        componentPath,
        createTest,
      })
    }

    // final log
    logs.done("Component created.")
    resolve()
  })
}

/**
 * return scaffold component function
 */
module.exports = scaffoldComponent
