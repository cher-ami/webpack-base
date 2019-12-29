import css from "./ArticlePage.module.less";
import React, { useRef } from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { prepareComponent } from "../../helpers/prepareComponent";
import Metas from "../../lib/react-components/metas";
import { usePageTransitionRegister } from "../../lib/router/usePageTransitionRegister";

interface IProps {
  classNames?: string[];
  parameters?: any;

  // from store
  setcurrentPageName?: (pPageName: string) => void;
  currentPageName?: string;
}

// prepare
const { component, log } = prepareComponent("ArticlePage");

/**
 * @name ArticlePage
 */
const ArticlePage = (props: IProps) => {
  // get current route
  const rootRef = useRef<HTMLDivElement>(null);

  // -------------------–-------------------–-------------------–--------------- PAGE TRANSITION

  const playIn = (): Promise<any> =>
    PageTransitionHelper.promisePlayIn(rootRef, () => log(`playIn complete`));

  const playOut = (): Promise<any> =>
    PageTransitionHelper.promisePlayOut(rootRef, () => log(`playOut complete`));

  // register page transition
  usePageTransitionRegister(component, playIn, playOut);

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div ref={rootRef} className={css.ArticlePage}>
      <Metas
        title={`${component} title`}
        description={`${component} description`}
      />
      {component}
      <h5>id {props.parameters.id}</h5>
      <h1>slug {props.parameters.slug}</h1>
    </div>
  );
};

export default ArticlePage;
