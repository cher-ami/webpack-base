import "./Main.less";
import ReactDOM from "react-dom";
import * as React from "react";
import GlobalConfig from "./common/data/GlobalConfig";
import { IRoute, Router } from "./common/lib/router/Router";
import { Provider } from "react-redux";
import configureStore from "./stores/index";
import AppView from "./components/appView";
import { EnvUtils } from "./common/lib/utils/EnvUtils";
import { App } from "./common/lib/core/App";
import { ENodeEnv } from "./common/types";

export default class Main extends App {
  // --------------------------------------------------------------------------- SINGLETON

  // singleton
  protected static __instance: Main;

  /**
   * Get Main class singleton instance.
   */
  public static get instance(): Main {
    return Main.__instance;
  }

  // --------------------------------------------------------------------------- CONFIG

  /**
   * Init app config
   */
  protected initConfig(): void {
    // Inject params into config
    GlobalConfig.inject({
      version: require("../package.json").version,
      baseURL: process.env.BASE_URL,
      routerBaseURL:
        // because we use proxy by default
        process.env.NODE_ENV === ENodeEnv.PROD ? process.env.BASE_URL : "",
      env: process.env.ENV
    });

    // log all global config
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
    /**
     * Routes list
     *  NOTE: Use import to load asynchronously
     *  importer: () => import("./pages/homePage")
     */
    const routes: IRoute[] = [
      {
        url: "/",
        page: "HomePage",
        importer: () => require("./pages/homePage")
      },
      {
        url: "/work-{slug}",
        page: "WorkPage",
        importer: () => require("./pages/workPage")
      }
    ];

    // add routes jsute by page name and importer
    // Router.addDynamicPageImporters(routes);

    // Init router (avec un tableau vide)
    Router.init(process.env.ROUTER_BASE, routes);

    // Add grav routes to router
    // CockpitPages.addCockpitRoutesToRouter();
  }

  // --------------------------------------------------------------------------- READY

  protected ready(): void {
    // React render
    ReactDOM.render(
      <Provider store={configureStore()}>
        <AppView />
      </Provider>,
      document.getElementById("AppContainer")
    );
  }
}
