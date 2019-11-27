import "./AppView.less";
import { hot } from "react-hot-loader/root";
import React from "react";
import { useLocation, useRoute, useRouter } from "wouter";
import MainMenu from "../mainMenu/MainMenu";
import { IPage } from "../../router/others/IPage";
import { getRoute } from "../../router/RoutesList";
import FunctionalStack from "../../router/FunctionalStack";
import { prepare } from "../../helpers/prepare";
import RouterRegister from "../../router/PageTransitionrRegister";
import { className } from "../../helpers/className";

interface IProps {}

// component name
const { component, log } = prepare("AppView");

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
      <div className={className(component, "playTest")}>
        {["HomePage", "BlogPage"].map((el, i) => (
          <div key={i}>
            {el}{" "}
            <span
              onClick={() => RouterRegister.transitions?.[el]?.playIn?.()}
              children={`playIn`}
            />
            {" / "}
            <span
              key={i}
              onClick={() => RouterRegister.transitions?.[el]?.playOut?.()}
              children={`playOut`}
            />
          </div>
        ))}
      </div>
      <MainMenu />
      <FunctionalStack />
    </div>
  );
}

export default hot(AppView);
