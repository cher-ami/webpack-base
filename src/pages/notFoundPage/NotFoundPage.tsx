import css from "./NotFoundPage.module.less";
import React, { useRef } from "react";
import { prepareComponent } from "../../helpers/prepareComponent";
import { merge } from "../../lib/helpers/classNameHelper";
import { usePageRegister } from "../../lib/router/usePageRegister";
import Metas from "../../lib/react-components/metas";

interface IProps {
  classNames?: string[];
}

// prepare
const { componentName, log } = prepareComponent("NotFoundPage");

/**
 * @name NotFoundPage
 */
const NotFoundPage = (props: IProps) => {
  // get current route
  const rootRef = useRef<HTMLDivElement>(null);

  // -------------------–-------------------–-------------------–--------------- PAGE TRANSITION

  const playIn = (): Promise<any> => new Promise(resolve => resolve);
  const playOut = (): Promise<any> => new Promise(resolve => resolve);
  usePageRegister({ componentName, rootRef, playIn, playOut });

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div ref={rootRef} className={merge([css.Root, componentName])}>
      <Metas
        title={`${componentName} 404`}
        description={`${componentName} description`}
      />
      {componentName}
    </div>
  );
};

export default NotFoundPage;
