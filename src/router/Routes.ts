import { ReactNode } from "react";
import HomePage from "../pages/homePage/HomePage";
import BlogPage from "../pages/blogPage/BlogPage";
import ArticlePage from "../pages/articlePage/ArticlePage";

export interface IRoute {
  // route name
  name: string;
  // route component instance
  component: ReactNode;
  // route path
  path: string;
  // show link in Menu
  showInMenu?: boolean;
}

// utils format path
const formatPath = (pPath: string) =>
  [
    // base url
    process.env.BASE_URL,
    // param
    pPath
  ]
    .filter(v => v)
    .join("");

/**
 * @name Routes
 * @description Define Router routes of application
 */
export const Routes: IRoute[] = [
  {
    name: "Home",
    component: HomePage,
    path: formatPath(""),
    showInMenu: true
  },
  {
    name: "Blog",
    component: BlogPage,
    path: formatPath("blog"),
    showInMenu: true
  },
  {
    name: "Article",
    component: ArticlePage,
    path: formatPath("blog/article"),
    showInMenu: true
  }
];
