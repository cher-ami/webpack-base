import { IRoute } from "./lib/router/Router";

/**
 * Routes list
 */
export const routes: IRoute[] = [
  {
    url: "/",
    page: "HomePage",
    importer: () => require("./pages/homePage/HomePage"),
  },
  {
    url: "/work/{slug}",
    page: "WorkPage",
    importer: () => require("./pages/workPage/WorkPage"),
  },
];
