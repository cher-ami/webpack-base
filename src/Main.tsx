import "./Main.less";
import ReactDOM from "react-dom";
import * as React from "react";
import { GlobalConfig } from "./data/GlobalConfig";
import { prepareComponent } from "./helpers/prepareComponent";
import { Router } from "./lib/solidify/navigation/Router";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import configureStore from "./stores/index";
import AppView from "./components/appView";

// prepare
const { log } = prepareComponent("Main");

// ----------------------------------------------------------------------------- INJECT DATA

// Inject params into config
GlobalConfig.instance.inject({
  version: require("../package.json").version,
  base: process.env.BASE_URL,
  env: process.env.ENV
});

log("GlobalConfig", {
  version: GlobalConfig.instance.version,
  base: GlobalConfig.instance.base,
  env: GlobalConfig.instance.env
});

// ----------------------------------------------------------------------------- ROUTES

// Init router
// Google analytics is automatically called when page is changing

Router.init(GlobalConfig.instance.base, [
  {
    url: "/",
    page: "HomePage",
    // Use require to load synchronously
    importer: () => require("./pages/homePage")
    // Use import to load asynchronously -> importer: () => import("./pages/homePage/HomePage")
  },
  {
    url: "/article-{#id}-{slug}",
    page: "ArticlePage",
    importer: () => require("./pages/articlePage")
  }
]);

// Enable auto link listening
Router.listenLinks();

// ----------------------------------------------------------------------------- START

// React render
ReactDOM.render(
  <Provider store={configureStore()}>
    <HelmetProvider>
      <AppView />
    </HelmetProvider>
  </Provider>,
  document.getElementById("AppContainer")
);
