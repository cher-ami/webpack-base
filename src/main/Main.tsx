import "./Main.less";
import ReactDOM from "react-dom";
import * as React from "react";
import GlobalConfig from "@common/data/GlobalConfig";
import { IRoute, Router } from "@common/lib/router/Router";
import AppView from "./components/appView";
import { EnvUtils } from "@common/lib/utils/EnvUtils";
import { App } from "@common/lib/core/App";
import { ENodeEnv } from "@common/types";
const debug = require("debug")("front:Main");

export default class Main extends App {
  // --------------------------------------------------------------------------- SINGLETON

  /**
   * Get Main class singleton instance.
   */
  protected static __instance: Main;
  public static get instance(): Main {
    return Main.__instance;
  }

  // --------------------------------------------------------------------------- CONFIG

  /**
   * Init app config
   */
  protected initConfig(): void {
    /**
     * Manage Router base URL
     *
     * with devServer, RouterBaseURL need to be "/" if:
     * - generateHtmlIndex: true
     * or
     * - useProxy: true
     * Because we will be redirected on localhost:3000, without base URL
     *
     * on production
     * Router base should be process.env.APP_BASE
     *
     */
    const routerBaseURL =
      process.env.NODE_ENV === ENodeEnv.DEV ? "/" : process.env.APP_BASE;

    // Inject params into config
    GlobalConfig.inject({
      version: require("../../package.json").version,
      baseUrl: process.env.APP_BASE,
      routerBaseUrl: routerBaseURL,
      env: process.env.ENV,
      bundleName: "Main"
    });

    // debug all global config
    GlobalConfig.log();
  }

  // --------------------------------------------------------------------------- ENV

  /**
   * Init env
   */
  protected initEnv(): void {
    // add env class to body
    EnvUtils.addClasses();
  }

  // --------------------------------------------------------------------------- ROUTES

  /**
   * Init routes
   */
  protected initRoutes(): void {
    // check if we use back end
    const useAddDynamicPageImporters = false;

    /**
     * Add dynamic page Importers
     * Add generated pages dependencies file to dynamic page import.
     * This will allow us to target pages by their names without explicit import.
     * NOTE: Only use if you don't specify importers in Router.init
     */
    if (useAddDynamicPageImporters) {
      Router.addDynamicPageImporters(require("./pages.ts"));
    }

    /**
     * Routes list
     */
    const routes: IRoute[] =
      // if we use dynamic page importer
      useAddDynamicPageImporters
        ? // return an empty array
          []
        : // else, return a static list of routes
          [
            {
              url: "/",
              page: "HomePage",
              importer: () => require("./pages/homePage")
            },
            {
              url: "/work/{slug}",
              page: "WorkPage",
              importer: () => require("./pages/workPage")
            }
          ];

    /**
     * Router init
     * Manage manualy your routes here in case you project got no backend
     *
     *  NOTE: Use import to load asynchronously
     *  importer: () => import("./pages/homePage")
     */
    Router.init(GlobalConfig.routerBaseUrl, routes);
    debug("Router.routes", Router.routes);
  }

  // --------------------------------------------------------------------------- READY

  protected ready(): void {
    // React render
    ReactDOM.render(<AppView />, document.getElementById("AppContainer"));
  }
}
