import css from "./App.module.less";
import React, { useEffect } from "react";
import LangService, { Link, Stack } from "@cher-ami/router";

const componentName = "App";
const debug = require("debug")(`front:${componentName}`);

export interface IProps {}

function App(props: IProps) {
  useEffect(() => {
    LangService.redirect();
  });

  return (
    <div className={css.root}>
      <nav>
        <ul>
          <li>
            <Link to={"/"}>Home</Link>{" "}
          </li>
          <li>
            <Link to={"/work/first-work"}>Work - id: "first-work"</Link>
          </li>
        </ul>
      </nav>
      <Stack className={css.stack} />
    </div>
  );
}

export default App;
