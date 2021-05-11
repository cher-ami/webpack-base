import "./index.less";
import ReactDOM from "react-dom";
import * as React from "react";
import App from "./components/app/App";
import { routes } from "./routes";
import { Router } from "@cher-ami/router";

const debug = require("debug")(`front:index`);
debug("version", require("../package.json").version);
debug("APP_BASE", process.env.APP_BASE);

(function initApp() {
  /**
   * Init React App with router
   */
  ReactDOM.render(
    <Router routes={routes} base={process.env.APP_BASE}>
      <App />
    </Router>,
    document.getElementById("root")
  );
})();
