import css from "./WorkPage.module.less";
import React, { useRef } from "react";
import { usePageRegister } from "../../common/lib/router/usePageRegister";
import Metas from "../../common/lib/react-components/metas";
import { prepare } from "../../common/helpers/prepare";
import { merge } from "../../common/lib/helpers/classNameHelper";
import PageTransitionHelper from "../../common/helpers/PageTransitionHelper";

interface IProps {
  classNames?: string[];
  parameters: any;
}

// prepare
const { componentName, log } = prepare("WorkPage");

/**
 * @name WorkPage
 */
const WorkPage = (props: IProps) => {
  // get current route
  const rootRef = useRef<HTMLDivElement>(null);

  // -------------------–-------------------–-------------------–--------------- REGISTER PAGE

  /**
   * playIn page transition
   * (remove this exemple if not use)
   */
  const playIn = (): Promise<any> => {
    return PageTransitionHelper.promisePlayIn(rootRef);
  };

  /**
   * playOut page transition
   * (remove this exemple if not use)
   */
  const playOut = (): Promise<any> => {
    return PageTransitionHelper.promisePlayOut(rootRef);
  };

  /**
   * Register page for ViewStack
   * NOTE: each page of ViewStack need to be register to work.
   * Minimal register should be: usePageRegister({ componentName, rootRef });
   * (remove playIn and playOut if not use)
   */
  usePageRegister({ componentName, rootRef, playIn, playOut });

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div className={merge([css.Root, componentName])} ref={rootRef}>
      <Metas
        title={`${componentName} title`}
        description={`${componentName} description`}
      />
      {componentName}
      <div>{props.parameters?.slug}</div>
    </div>
  );
};

export default WorkPage;
