import "./Main.less";
import ReactDOM from "react-dom";
import * as React from "react";
import AppView from "./components/appView/AppView";
import { GlobalConfig } from "./data/GlobalConfig";

// ----------------------------------------------------------------------------- INJECT DATA

// Inject params into config
GlobalConfig.instance.inject({
  version: require("../package.json").version,
  base: process.env.BASE_URL
});

// ----------------------------------------------------------------------------- LOG

// Add version log in console
console.log(
  `%c version: ${GlobalConfig.instance.version} `,
  "background: #2b2b2b; color: #69cbdf; padding: 2px 2px 3px"
);

// ----------------------------------------------------------------------------- START

// React render
ReactDOM.render(<AppView />, document.getElementById("AppContainer"));
