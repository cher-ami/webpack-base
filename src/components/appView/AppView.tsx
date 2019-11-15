import "./AppView.less";
import { hot } from "react-hot-loader/root";
import React from "react";
import { useLocation } from "wouter";
import MainMenu from "../mainMenu/MainMenu";
import RouterStack, { ETransitionType } from "../../router/RouterStack";
import { IPage } from "../../router/IPage";

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

  /**
   * Transition manager between all React pages.
   * Useful if you want a custom transition behavior other than SEQUENTIAL or CROSSED.
   * You can setup a generic transition between all pages and do special cases here.
   * @param {HTMLElement} $oldPage Old page HTMLElement. Can be null.
   * @param {HTMLElement} $newPage New page HTMLElement.
   * @param {IPage} pOldPage Old page component instance. Can be null.
   * @param {IPage} pNewPage New page component instance.
   * @return {Promise<any>}
   */
  function transitionControl(
    $oldPage: HTMLElement,
    $newPage: HTMLElement,
    pOldPage: IPage,
    pNewPage: IPage
  ) {
    return new Promise(async resolve => {
      // TODO Test
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
        location={location}
        transitionType={ETransitionType.CONTROLLED}
        transitionControl={transitionControl}
      />
    </div>
  );
}

export default hot(AppView);
