require("colors")

/**
 * Node command line
 */

const help = () => {
  console.log(
    `${"Available tasks: "}

  ${"npm run dev".brightBlue}
  > start dev server.
      
  ${"npm run reset".brightBlue}
  > remove compile files and node_modules + npm i.
         
  ${"npm run scaffold".brightBlue}
  > create a new component.
  
  ${"npm run setup".brightBlue}
  > setup this project again like the first time you installed webpack-base.
  
  ${"npm run prettier".brightBlue}
  > prettify sources. This appended on each pre-commit.
      `
  )
}

module.exports = { help }
