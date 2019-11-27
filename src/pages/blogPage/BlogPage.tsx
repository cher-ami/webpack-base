import "./BlogPage.less";
import React, { useRef } from "react";
import { prepare } from "../../helpers/prepare";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import usePageTransitionRegister from "../../router/usePageTransitionRegister";

interface IProps {
  classNames?: string[];
}

const { component, log } = prepare("BlogPage");

/**
 * @name BlogPage
 */
function BlogPage(props: IProps) {
  // get current route
  const rootRef = useRef<HTMLDivElement>(null);

  // -------------------–-------------------–-------------------–--------------- PAGE TRANSITION

  // playIn
  const playIn = (): Promise<any> =>
    PageTransitionHelper.promisePlayIn(rootRef, () =>
      log(`${component}, playIn complete!`)
    );

  // playOut
  const playOut = (): Promise<any> =>
    PageTransitionHelper.promisePlayOut(rootRef, () =>
      log(`${component}, playOut complete!`)
    );

  // register route transition
  usePageTransitionRegister(component, playIn, playOut);

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div ref={rootRef} className={component}>
      {component}
    </div>
  );
}

export default BlogPage;
