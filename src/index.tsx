import "./index.less";
import ReactDOM from "react-dom";
import * as React from "react";
import GlobalConfig from "data/GlobalConfig";
import { EnvUtils } from "lib/utils/EnvUtils";
import App from "./components/app/App";
import { routes } from "./routes";
import { Router } from "@cher-ami/router";

const fileName = "index";
const debug = require("debug")(`front:${fileName}`);

(function initApp() {
  /**
   * Init global config
   */
  GlobalConfig.inject({
    version: require("../package.json").version,
    baseUrl: process.env.APP_BASE,
  });

  /**
   * Add env classes
   */
  EnvUtils.addClasses();

  /**
   * Init React App
   */
  ReactDOM.render(
    <Router routes={routes} base={"/"}>
      <App />
    </Router>,
    document.getElementById("root")
  );
})();
