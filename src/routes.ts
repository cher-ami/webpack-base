import { IRoute } from "./lib/router/Router";

export enum ERouterPage {
  HOME_PAGE = "HomePage",
  WORK_PAGE = "WorkPage",
}

export const routes: IRoute[] = [
  {
    url: "/{lang}/",
    page: ERouterPage.HOME_PAGE,
    importer: () => require("./pages/homePage/HomePage"),
  },
  {
    url: "/{lang}/work/{slug}",
    page: ERouterPage.WORK_PAGE,
    importer: () => require("./pages/workPage/WorkPage"),
  },
];
