import css from "./HomePage.module.less";
import { useEffect, useRef } from "react";
import * as React from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { prepareComponent } from "../../helpers/prepareComponent";
import Metas from "../../lib/react-components/metas";
import { usePageRegister } from "../../lib/router/usePageRegister";
import { merge } from "../../lib/helpers/classNameHelper";

interface IProps {
  classNames?: string[];

  // from store
  setcurrentPageName?: (pPageName: string) => void;
  currentPageName?: string;
}

// prepare
const { componentName, log } = prepareComponent("HomePage");

const HomePage = (props: IProps) => {
  // get current route
  const rootRef = useRef<HTMLDivElement>(null);

  // -------------------–-------------------–-------------------–--------------- PAGE TRANSITION

  // register page transition
  usePageRegister({
    componentName,
    rootRef,
    playIn: (): Promise<any> => PageTransitionHelper.promisePlayIn(rootRef),
    playOut: (): Promise<any> => PageTransitionHelper.promisePlayOut(rootRef)
  });

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div className={merge([css.Root, componentName])} ref={rootRef}>
      <Metas
        title={`${componentName} title`}
        description={`${componentName} description`}
      />
      {componentName}
    </div>
  );
};

export default HomePage;
