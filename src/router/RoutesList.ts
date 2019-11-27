import { ReactNode } from "react";
import HomePage from "../pages/homePage/HomePage";
import BlogPage from "../pages/blogPage/BlogPage";
import ArticlePage from "../pages/articlePage/ArticlePage";

// ----------------------------------------------------------------------------- ROUTES

export interface IRoute {
  // route path
  path: string;
  //
  as: string;
  // route component instance
  component: ReactNode;
  // string component name
  componentName: string;
  // meta
  meta: { [x: string]: any };
}

// utils format path
const formatPath = (pPath: string) =>
  [
    // base url
    //process.env.BASE_URL,
    "/",
    // param
    pPath
  ]
    .filter(v => v)
    .join("");

/**
 * @name RoutesList
 * @description Define Router routes of application
 */
export const RoutesList: IRoute[] = [
  {
    component: HomePage,
    componentName: "HomePage",
    path: formatPath(""),
    as: formatPath(""),
    meta: {
      name: "Home",
      showInMenu: true
    }
  },
  {
    component: BlogPage,
    componentName: "BlogPage",
    path: formatPath("blog"),
    as: formatPath("blog"),
    meta: {
      name: "Blog",
      showInMenu: true
    }
  },
  {
    component: ArticlePage,
    componentName: "ArticlePage",
    path: formatPath("blog/:id"),
    as: formatPath("blog/coucou"),
    meta: {
      name: "Article",
      showInMenu: true
    }
  }
];

// ----------------------------------------------------------------------------- HELPERS

/**
 * @name getRoute
 * @description Passe current location and get current route component
 * @param pRoutes
 * @param pDependOf
 * @param pLocation
 */
export const getRoute = ({
  pRoutes = RoutesList,
  pLocation,
  pParams
}: {
  pRoutes?: IRoute[];
  pLocation: string;
  pParams?: object;
}) => {
  // check
  if (!pRoutes || !pLocation) return;
  // Aller taper dans le tableau de route pour savoir quel composant match avec l'url
  return pRoutes.find(el => el.as === pLocation);
};
