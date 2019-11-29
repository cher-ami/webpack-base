import "./AppView.less";
import { hot } from "react-hot-loader/root";
import React from "react";
import { useLocation, useRoute, useRouter } from "wouter";
import MainMenu from "../mainMenu/MainMenu";
import { getRoute } from "../../router/RoutesList";
import RouterStack from "../../router/RouterStack";
import { prepare } from "../../helpers/prepare";
import { className } from "../../helpers/className";
import { pagesTransitionsList } from "../../router/usePageTransitionRegister";
import RouterClassStack from "../../router/others/RouterClassStack";

interface IProps {}

// component name
const { component, log } = prepare("AppView");

/**
 * @name AppView
 * @description
 */
function AppView(props: IProps) {
  // get current Location
  const [location] = useLocation();
  const [match, params] = useRoute(getRoute({ pLocation: location })?.path);
  const router = useRouter();

  /**
   * Transition manager
   */
  function transitionControl(
    $oldPage: HTMLElement,
    $newPage: HTMLElement,
    pOldPage,
    pNewPage
  ): Promise<any> {
    return new Promise(async resolve => {
      await pOldPage.playOut();
      await pOldPage.playIn();
      resolve();
    });
  }

  // --------------------------------------------------------------------------- RENDER
  return (
    <div className={component}>
      {/* TEST TODO remove */}
      <div className={className(component, "playTest")}>
        {["HomePage", "BlogPage"].map((el, i) => (
          <div key={i}>
            {el}{" "}
            <span
              onClick={() => pagesTransitionsList?.[el]?.playIn?.()}
              children={`playIn`}
            />
            {" / "}
            <span
              key={i}
              onClick={() => pagesTransitionsList?.[el]?.playOut?.()}
              children={`playOut`}
            />
          </div>
        ))}
      </div>
      <MainMenu />
      <RouterStack location={location} transitionControl={transitionControl} />
      {/*<RouterClassStack*/}
      {/*  location={location}*/}
      {/*  transitionControl={transitionControl}*/}
      {/*/>*/}
    </div>
  );
}

export default hot(AppView);
