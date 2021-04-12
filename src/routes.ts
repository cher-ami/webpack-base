import { TRoute } from "@cher-ami/router";
import HomePage from "./pages/homePage/HomePage";
import WorkPage from "./pages/workPage/WorkPage";
import NotFoundPage from "./pages/notFoundPage/NotFoundPage";

export enum EPage {
  HOME_PAGE = "HomePage",
  WORK_PAGE = "WorkPage",
  NOT_FOUND_PAGE = "NotFoundPage",
}

export const routes: TRoute[] = [
  {
    path: "/",
    component: HomePage,
    name: EPage.HOME_PAGE,
  },
  {
    path: "/work/:id",
    component: WorkPage,
    name: EPage.WORK_PAGE,
  },
  {
    path: "/:rest",
    component: NotFoundPage,
    name: EPage.NOT_FOUND_PAGE,
  },
];
