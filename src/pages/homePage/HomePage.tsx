import css from "./HomePage.module.less";
import { useEffect, useRef } from "react";
import * as React from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { prepareComponent } from "../../helpers/prepareComponent";
import Metas from "../../lib/react-components/metas";
import { pagesStack, usePageStack } from "../../lib/router/usePageStack";

interface IProps {
  classNames?: string[];

  // from store
  setcurrentPageName?: (pPageName: string) => void;
  currentPageName?: string;
}

// prepare
const { componentName, log } = prepareComponent("HomePage");

interface IProps {
  classNames?: string[];
}

/**
 * @name HomePage
 */
const HomePage = (props: IProps) => {
  // get current route
  const rootRef = useRef<HTMLDivElement>(null);

  // -------------------–-------------------–-------------------–--------------- PAGE TRANSITION

  const playIn = (): Promise<any> =>
    PageTransitionHelper.promisePlayIn(rootRef, () => log(`playIn complete`));

  const playOut = (): Promise<any> =>
    PageTransitionHelper.promisePlayOut(rootRef, () => log(`playOut complete`));

  usePageStack({ componentName, rootRef, playIn, playOut });

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div ref={rootRef} className={css.HomePage}>
      <Metas
        title={`${componentName} title`}
        description={`${componentName} description`}
      />
      {componentName}
    </div>
  );
};

export default HomePage;
