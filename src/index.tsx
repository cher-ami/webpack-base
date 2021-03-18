import "./index.less";
import ReactDOM from "react-dom";
import * as React from "react";
import GlobalConfig from "data/GlobalConfig";
import { EnvUtils } from "lib/utils/EnvUtils";
import App from "./components/app/App";
import { routes } from "./routes";
import {langMiddleware, Router, TLanguage} from "@cher-ami/router"
import LangService from "@cher-ami/router";

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
  const base = "/";
  const langs: TLanguage[] = [{ key: "en" }, { key: "fr" }];
  LangService.init(langs, true, base);

  ReactDOM.render(
    <Router routes={routes} base={base} middlewares={[langMiddleware]}>
      <App />
    </Router>,
    document.getElementById("root")
  );
})();
