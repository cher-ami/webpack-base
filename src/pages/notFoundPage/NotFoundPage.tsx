import css from "./NotFoundPage.module.less";
import React, { useRef } from "react";
import { usePageRegister } from "../../common/lib/router/usePageRegister";
import Metas from "../../common/lib/react-components/metas";
import { prepareComponent } from "../../common/helpers/prepareComponent";
import {merge} from "../../common/lib/helpers/classNameHelper"

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
