import css from "./ArticlePage.module.less";
import React, { useEffect, useRef } from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { prepareComponent } from "../../helpers/prepareComponent";
import Metas from "../../lib/react-components/metas";
import { pagesStackList, usePageStack } from "../../lib/router/usePageStack";

interface IProps {
  classNames?: string[];
  parameters?: any;

  // from store
  setcurrentPageName?: (pPageName: string) => void;
  currentPageName?: string;
}

// prepare
const { componentName, log } = prepareComponent("ArticlePage");

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
  usePageStack({ componentName, rootRef, playIn, playOut });

  useEffect(() => log("pagesStackList", pagesStackList), []);

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div ref={rootRef} className={css.ArticlePage}>
      <Metas
        title={`${componentName} title`}
        description={`${componentName} description`}
      />
      {componentName}
      <h5>id {props.parameters.id}</h5>
      <h1>slug {props.parameters.slug}</h1>
    </div>
  );
};

export default ArticlePage;
