import "./AppView.less";
import { hot } from "react-hot-loader/root";
import React from "react";
import { useLocation, useRoute, useRouter } from "wouter";
import MainMenu from "../mainMenu/MainMenu";
import RouterStack, { ETransitionType } from "../../router/RouterStack";
import { IPage } from "../../router/IPage";
import { getRoute } from "../../router/RoutesList";

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
      <RouterStack
        params={params}
        location={location}
        transitionType={ETransitionType.SEQUENTIAL}
        transitionControl={transitionControl}
      />
    </div>
  );
}

export default hot(AppView);
