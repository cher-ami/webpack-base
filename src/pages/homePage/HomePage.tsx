import css from "./HomePage.module.less";
import { useRef } from "react";
import * as React from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { prepareComponent } from "../../helpers/prepareComponent";
import Metas from "../../lib/react-components/metas";
import {
  pagesTransitionsList,
  usePageTransitionRegister
} from "../../lib/router/usePageTransitionRegister";

interface IProps {
  classNames?: string[];

  // from store
  setcurrentPageName?: (pPageName: string) => void;
  currentPageName?: string;
}

// prepare
const { component, log } = prepareComponent("HomePage");

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

  // register page transition
  usePageTransitionRegister(component, playIn, playOut);

  log(pagesTransitionsList);

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div ref={rootRef} className={css.HomePage}>
      <Metas
        title={`${component} title`}
        description={`${component} description`}
      />
      {component}
    </div>
  );
};

export default HomePage;
