import css from "./HomePage.module.less";
import React, { useRef } from "react";
import { usePageRegister } from "../../common/lib/router/usePageRegister";
import Metas from "../../common/lib/react-components/metas";
import PageTransitionHelper from "../../common/helpers/PageTransitionHelper";
import { prepareComponent } from "../../common/helpers/prepareComponent";
import {merge} from "../../common/lib/helpers/classNameHelper"


interface IProps {
  classNames?: string[];

  // from store
  setcurrentPageName?: (pPageName: string) => void;
  currentPageName?: string;
}

// prepare
const { componentName, log } = prepareComponent("HomePage");

/**
 * @name HomePage
 */

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
