import "./Main.less";
import ReactDOM from "react-dom";
import * as React from "react";
import AppView from "./components/appView/AppView";
import { GlobalConfig } from "./data/GlobalConfig";
import { prepare } from "./helpers/prepare";
import { Router } from "./lib/solidify-lib/navigation/Router";

const { component, log } = prepare("Main");

// ----------------------------------------------------------------------------- INJECT DATA

// Inject params into config
GlobalConfig.instance.inject({
  version: require("../package.json").version,
  base: process.env.BASE_URL
});

log(process.env.BASE_URL);
log(process.env.NODE_ENV);
log(process.env);

// ----------------------------------------------------------------------------- LOG

// Add version log in console
log(
  `%c version: ${GlobalConfig.instance.version} `,
  "background: #2b2b2b; color: #69cbdf; padding: 2px 2px 3px"
);

// ----------------------------------------------------------------------------- ROUTES

// Init router
// Google analytics is automatically called when page is changing

Router.init(GlobalConfig.instance.base, [
  {
    url: "/",
    page: "HomePage",
    // Use require to load synchronously
    importer: () => require("./pages/homePage/HomePage")
    // Use import to load asynchronously
    // importer: () => import("./pages/homePage/HomePage")
  },
  {
    url: "/blog",
    page: "BlogPage",
    importer: () => require("./pages/blogPage/BlogPage")
  },
  {
    url: "/article-{#id}-{slug}",
    page: "ArticlePage",
    importer: () => require("./pages/articlePage/ArticlePage")
  }
]);

// Enable auto link listening
Router.listenLinks();

// ----------------------------------------------------------------------------- START

// React render
ReactDOM.render(<AppView />, document.getElementById("AppContainer"));
