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
      appURL: process.env.APP_URL,
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
   * Routes List
   */
  public static routes: IRoute[] = [
    {
      url: "/",
      page: "HomePage",
      // Use require to load synchronously
      importer: () => require("./pages/homePage"),
      // Use import to load asynchronously -> importer: () => import("./pages/homePage")
      metas: {
        name: "Home",
        showInMenu: true
      }
    },
    {
      url: "/article-{slug}",
      page: "ArticlePage",
      importer: () => import("./pages/articlePage"),
      parameters: {
        slug: "custom-slug-article"
      },
      metas: {
        name: "Article 1",
        showInMenu: true
      }
    }
  ];

  /**
   * Init routes
   */
  protected initRoutes(): void {
    Router.init(GlobalConfig.routerBaseURL, Main.routes);
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
