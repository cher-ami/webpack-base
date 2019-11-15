import "./AppView.less";
import { hot } from "react-hot-loader/root";
import React from "react";
import { useLocation } from "wouter";
import MainMenu from "../mainMenu/MainMenu";
import Stack from "../../router/Stack";
import StackClass, { ETransitionType } from "../../router/StackClass";

interface IProps {}

// component name
const component: string = "AppView";

/**
 * @name AppView
 * @description
 */
function AppView(props: IProps) {
  // --------------------------------------------------------------------------- PREPARE

  // --------------------------------------------------------------------------- RENDER
  const [location, setLocation] = useLocation();
  return (
    <div className={component}>
      <MainMenu />
      <Stack transitionType={ETransitionType.PAGE_CROSSED} />
      {/*<StackClass*/}
      {/*  location={location}*/}
      {/*  transitionType={ETransitionType.PAGE_CROSSED}*/}
      {/*/>*/}
    </div>
  );
}

export default hot(AppView);
