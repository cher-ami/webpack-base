import "./AppView.less";
import { hot } from "react-hot-loader/root";
import React from "react";
import { useLocation } from "wouter";
import MainMenu from "../mainMenu/MainMenu";
import RouterStack, { ETransitionType } from "../../router/RouterStack";

interface IProps {}

// component name
const component: string = "AppView";

/**
 * @name AppView
 * @description
 */
function AppView(props: IProps) {
  // get current Location
  const [location, setLocation] = useLocation();

  // --------------------------------------------------------------------------- RENDER
  return (
    <div className={component}>
      <MainMenu />
      <RouterStack
        location={location}
        transitionType={ETransitionType.PAGE_SEQUENTIAL}
      />
    </div>
  );
}

export default hot(AppView);
