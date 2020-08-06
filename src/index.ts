import "./index.less";
import ReactDOM from "react-dom";
import * as React from "react";
import GlobalConfig from "data/GlobalConfig";
import { Router } from "lib/router/Router";
import { EnvUtils } from "lib/utils/EnvUtils";
import App from "./components/app/App";
import { routes } from "./routes";

const fileName = "index";
const debug = require("debug")(`front:${fileName}`);

(function initApp() {
  /**
   * Init global config
   */
  GlobalConfig.inject({
    version: require("../package.json").version,
    baseUrl: process.env.APP_BASE,
    routerBaseUrl: process.env.APP_BASE,
    env: process.env.ENV,
  });

  /**
   * Add env classes
   */
  EnvUtils.addClasses();

  /**
   * Init Router
   */
  Router.init(GlobalConfig.routerBaseUrl, routes);
  debug("Router.routes", Router.routes);

  /**
   * Init React App
   */
  ReactDOM.render(
    React.createElement(App, {}, null),
    document.getElementById("AppContainer")
  );
})();
