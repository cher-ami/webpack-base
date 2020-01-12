require("colors");

/**
 * Node command line
 */
module.exports = () => {
  console.log(
    `${"Available tasks: "}

  ${"npm run dev".white.bold}
  > start dev server.
      
  ${"npm run clean".white.bold}
  > clean cache. 
      
  ${"npm run reset".white.bold}
  > remove compile files and node_modules + npm i.
      
  ${"npm run prettier".white.bold}
  > prettify sources. This appended on each pre-commit.
     
  ${"npm run scaffold".white.bold}
  > create a new component.
      
  ${"npm run sprites".white.bold}
  > generate sprites from src/sprites/ folder.
  
  ${"npm run setup".white.bold}
  > setup this project again like the first time you installed webpack-base.
  
      `
  );
};
