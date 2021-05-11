import "./index.less"
import ReactDOM from "react-dom"
import * as React from "react"
import App from "./components/app/App"
import { routes } from "./routes"
import { Router } from "@cher-ami/router"
const debug = require("debug")(`front:index`)
debug("version:", require("../package.json").version)
;(function initApp() {
  /**
   * Init React App
   */
  ReactDOM.render(
    <Router routes={routes} base={process.env.APP_BASE}>
      <App />
    </Router>,
    document.getElementById("root")
  )
})()
