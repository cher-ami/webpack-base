import css from "./NotFoundPage.module.less";
import React, { RefObject, useRef } from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { ReactPage } from "../../lib/core/ReactPage";
import { prepareComponent } from "../../helpers/prepareComponent";
import { usePageRegister } from "../../lib/router/usePageRegister";
import Metas from "../../lib/react-components/metas";

interface IProps {
  classNames?: string[];
}
interface IStates {}

// prepare
const { componentName, log } = prepareComponent("NotFoundPage");

/**
 * @name NotFoundPage
 */
const NotFoundPage = (props: IProps) => {
  // get current route
  const rootRef = useRef<HTMLDivElement>(null);

  // -------------------–-------------------–-------------------–--------------- PAGE TRANSITION

  const playIn = (): Promise<any> => {
    return new Promise<any>(resolve => resolve);
  };
  const playOut = (): Promise<any> => {
    return new Promise<any>(resolve => resolve);
  };

  usePageRegister({ componentName, rootRef, playIn, playOut });

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div ref={rootRef} className={css.NotFoundPage}>
      <Metas
        title={`${componentName} 404`}
        description={`${componentName} description`}
      />
      {componentName}
    </div>
  );
};

export default NotFoundPage;
