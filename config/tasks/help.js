require("colors");

/**
 * Node command line
 */
module.exports = () => {
  console.log(
    `${"Available tasks: "}

    ${"npm run dev".yellow.bold}
    > start dev server.
    
    ${"npm run clean".yellow.bold}
    > clean cache. 
    
    ${"npm run reset".yellow.bold}
    > remove compile files and node_modules + npm i.
    
    ${"npm run prettier".yellow.bold}
    > prettify sources. This appended on each pre-commit.
   
    ${"npm run scaffold".yellow.bold}
    > create a new component.
    
    ${"npm run sprites".yellow.bold}
    > generate sprites from src/sprites/ folder.
      `
  );
};
