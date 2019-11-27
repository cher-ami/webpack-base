import "./HomePage.less";
import React, { useRef } from "react";
import { prepare } from "../../helpers/prepare";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import useRouteTransition from "../../router/useRouteTransition";

interface IProps {
  classNames?: string[];
}

const { component, log } = prepare("HomePage");

/**
 * @name HomePage
 */
function HomePage(props: IProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // playIn
  const playIn = (): Promise<any> =>
    PageTransitionHelper.promisePlayIn(rootRef, () =>
      log(`${component}, playIIn complete!`)
    );

  // playOut
  const playOut = (): Promise<any> =>
    PageTransitionHelper.promisePlayOut(rootRef, () =>
      log(`${component}, playOut complete!`)
    );

  // register route transition
  useRouteTransition(component, playIn, playOut);

  return (
    <div ref={rootRef} className={component}>
      {component}
    </div>
  );
}

export default HomePage;
