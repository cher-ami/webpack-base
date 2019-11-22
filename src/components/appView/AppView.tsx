import "./AppView.less";
import { hot } from "react-hot-loader/root";
import React from "react";
import { useLocation, useRoute, useRouter } from "wouter";
import MainMenu from "../mainMenu/MainMenu";
import { IPage } from "../../router/others/IPage";
import { getRoute } from "../../router/RoutesList";
import FunctionalStack from "../../router/FunctionalStack";

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
  const [match, params] = useRoute(getRoute({ pLocation: location })?.path);
  const router = useRouter();

  /**
   * Transition manager
   */
  function transitionControl(
    $oldPage: HTMLElement,
    $newPage: HTMLElement,
    pOldPage: IPage,
    pNewPage: IPage
  ) {
    return new Promise(async resolve => {
      await pOldPage.playOut();
      await pOldPage.playIn();
      resolve();
    });
  }

  // --------------------------------------------------------------------------- RENDER
  return (
    <div className={component}>
      <MainMenu />
      <FunctionalStack />
    </div>
  );
}

export default hot(AppView);
