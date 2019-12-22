require("colors");

/**
 * Node command line
 */
module.exports = () => {
  console.log(
    `${"Available tasks: "}

    ${"npm run dev".blue.bold}
    > start dev server.
    
    ${"npm run clean".blue.bold}
    > clean cache. 
    
    ${"npm run reset".blue.bold}
    > remove compile files and node_modules + npm i.
    
    ${"npm run prettier".blue.bold}
    > prettify sources. This appended on each pre-commit.
   
    ${"npm run scaffold".blue.bold}
    > create a new component.
    
    ${"npm run sprites".blue.bold}
    > generate sprites from src/sprites/ folder.
      `
  );
};
