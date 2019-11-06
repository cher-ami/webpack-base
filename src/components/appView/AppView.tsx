import { hot } from "react-hot-loader/root";
import * as React from "react";
import "./AppView.less";

interface IProps {
  classNames?: string[];
}

// component name
const component: string = "AppView";

/**
 * @name AppView
 * @param props
 * @constructor
 */
function AppView(props: IProps) {
  // render
  return <div className={component}>{component}</div>;
}

// export by default with hot module reload enable
export default hot(AppView);
