const Inquirer = require("inquirer");
const path = require("path");
const paths = require("../paths");
const config = require("../config");
const { Files } = require("@zouloux/files");
const changeCase = require("change-case");
const { QuickTemplate } = require("../helpers/helper-template");
// Some colors in the terminal @see : https://github.com/marak/colors.js/
require("colors");

// ----------------------------------------------------------------------------- LOGS

/**
 * Show a success message
 * @param pMessage Message to show
 */
const showSuccess = pMessage => {
  console.log(`→ ${pMessage}\n`.cyan);
};

/**
 * Show set of instructions and examples
 * @param pInstructions instructions list
 * @param pExamples examples list, optional
 */
const showInstructions = (pInstructions, pExamples) => {
  console.log("Read carefully:".yellow.bold);

  // Show instructions
  pInstructions.map((instruction, i) => {
    console.log(`${i + 1}. ${instruction}`.yellow);
  });

  // Show examples
  pExamples &&
    pExamples.map((example, i) => {
      i === 0 && console.log("");
      console.log(`${example}`.yellow);
    });

  console.log("");
};

// ----------------------------------------------------------------------------- COMMON TASKS

/**
 * Ask for the component folder
 */
const askWhichComponentFolder = () => {
  return Inquirer.prompt({
    type: "list",
    name: "subFolder",
    message: "Which component folder?",
    choices: config.componentCompatibleFolders
  });
};

/**
 * Ask for the component name
 */
const askComponentName = () => {
  return Inquirer.prompt({
    type: "input",
    message: "component name? (classCase)",
    name: "componentName"
  });
};

const askConnectToStore = () => {
  return Inquirer.prompt({
    type: "confirm",
    message: "connect component to store ?",
    name: "connectToStore",
    default: false
  });
};

/**
 * Ask question and scaffold a component with a specific script template
 * @returns {Promise<any>}
 */
const componentScaffolder = () =>
  new Promise(async resolve => {
    // Static sub-folder for pages

    let subFolder = "";
    // Get sub-folder for components
    await askWhichComponentFolder().then(answer => {
      subFolder = answer.subFolder;
    });

    // Get component name
    let componentName = "";
    await askComponentName().then(answer => {
      componentName = answer.componentName;
    });

    // Get connect to store response
    let connectToStore = false;
    await askConnectToStore().then(answer => {
      connectToStore = answer.connectToStore;
    });

    // component name "ComponentName" for subfolder and component
    let lowerComponentName = changeCase.camelCase(componentName);
    let upperComponentName = changeCase.pascalCase(componentName);

    // Base path of the component (no extension here)
    let componentPath = `${paths.src}/${subFolder}/${lowerComponentName}`;

    // Check if component already exists
    if (Files.getFiles(`${componentPath}.js`).files.length > 0) {
      console.log(`This component already exists. Aborting.`.red.bold);
      return;
    }

    // choose between page and component type
    const type = subFolder === "pages" ? "reactPage" : "reactComponent";

    // Scaffold the script
    Files.new(`${componentPath}/${upperComponentName}.tsx`).write(
      QuickTemplate(Files.getFiles(`${paths.skeletonsPath}/${type}`).read(), {
        capitalComponentName: upperComponentName,
        componentType: subFolder
      })
    );

    // index type depend of conect to store answer
    const indexType = connectToStore ? "reactIndexRedux" : "reactIndex";

    Files.new(`${componentPath}/index.ts`).write(
      QuickTemplate(
        Files.getFiles(`${paths.skeletonsPath}/${indexType}`).read(),
        {
          capitalComponentName: upperComponentName
        }
      )
    );

    Files.new(`${componentPath}/${upperComponentName}.less`).write(
      QuickTemplate(
        Files.getFiles(`${paths.skeletonsPath}/lessComponent`).read(),
        {
          capitalComponentName: upperComponentName,
          componentType: subFolder
        }
      )
    );

    // Done
    showSuccess("Component created!");
    resolve();
  });

// ----------------------------------------------------------------------------- SCAFFOLDERS

const scaffolders = [
  /**
   * Scaffold a react based component
   */
  {
    name: "React",
    exec: () => componentScaffolder()
  }
];

// ----------------------------------------------------------------------------- PUBLIC API
const scaffold = () =>
  new Promise(resolve => {
    // Get scaffolder to present listing to user
    let scaffolderTypes = scaffolders.map(scaffolder => scaffolder.name);

    // List available scaffolders to user
    Inquirer.prompt({
      type: "list",
      name: "type",
      message: "What kind of component to create?",
      choices: scaffolderTypes,
      pageSize: 20
    }).then(answer => {
      // Get scaffolder index
      const scaffolderIndex = scaffolderTypes.indexOf(answer.type);

      // Start this scaffolder
      scaffolders[scaffolderIndex].exec();
    });
  });

module.exports = scaffold();
