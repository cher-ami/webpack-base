/**
 * IMPORTANT, need to be dynamic
 */
const pages = [
  {
    page: "HomePage",
    importer: () => require("./pages/homePage")
  },
  {
    page: "WorkPage",
    importer: () => require("./pages/workPage")
  }
];
