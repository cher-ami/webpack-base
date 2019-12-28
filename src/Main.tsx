import "./Main.less";
import ReactDOM from "react-dom";
import * as React from "react";
import { GlobalConfig } from "./data/GlobalConfig";
import { prepareComponent } from "./helpers/prepareComponent";
import { Router } from "./lib/navigation/Router";
import { Provider } from "react-redux";
import configureStore from "./stores/index";
import AppView from "./components/appView";
import { EnvUtils } from "./lib/utils/EnvUtils";
import { App } from "./lib/core/App";
import MetasManager from "./components/metas/MetasManager";

// prepare
const { log } = prepareComponent("Main");

export default class Main extends App {
  // ----------------------------------------------------------------------------- SINGLETON

  // singleton
  protected static __instance: Main;

  /**
   * Get Main class singleton instance.
   */
  public static get instance(): Main {
    return Main.__instance;
  }

  // ----------------------------------------------------------------------------- CONFIG
  /**
   * Init app config
   */
  protected initConfig(): void {
    // Inject params into config
    GlobalConfig.instance.inject({
      version: require("../package.json").version,
      base: process.env.BASE_URL,
      env: process.env.ENV
    });

    // log Global config
    log("GlobalConfig", {
      version: GlobalConfig.instance.version,
      base: GlobalConfig.instance.base,
      env: GlobalConfig.instance.env
    });
  }
  // ----------------------------------------------------------------------------- METAS

  protected initMetas(): void {
    // set default meta
    MetasManager.defaultMetas = {
      title: "default metas title",
      description: "default meta",
      siteName: require("../package.json").name,
      author: require("../package.json").author
    };
  }

  // ----------------------------------------------------------------------------- ENV

  /**
   * Init env
   */
  protected initEnv(): void {
    // add env class to body
    EnvUtils.addClasses();
  }

  // ----------------------------------------------------------------------------- ROUTES

  /**
   * Routes List
   */
  public static routes = [
    {
      url: "/",
      page: "HomePage",
      // Use require to load synchronously
      importer: () => require("./pages/homePage"),
      // Use import to load asynchronously -> importer: () => import("./pages/homePage")
      metas: {
        name: "Home"
      }
    },
    {
      url: "/article-{#id}-{slug}",
      page: "ArticlePage",
      importer: () => require("./pages/articlePage"),
      metas: {
        name: "Article"
      },
      parameters: {
        id: 10,
        slug: "custom-slug-article"
      }
    }
  ];

  /**
   * Init routes
   */
  protected initRoutes(): void {
    // Init router
    Router.init(GlobalConfig.instance.base, Main.routes);
  }

  // ----------------------------------------------------------------------------- READY

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

/**
 * Start Main App
 */
new Main();
