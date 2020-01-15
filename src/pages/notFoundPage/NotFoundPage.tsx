import css from "./NotFoundPage.module.less";
import React, { useRef } from "react";
import { usePageRegister } from "../../common/lib/router/usePageRegister";
import Metas from "../../common/lib/react-components/metas";
import { prepare } from "../../common/helpers/prepare";
import { merge } from "../../common/lib/helpers/classNameHelper";

interface IProps {
  classNames?: string[];
}

// prepare
const { componentName, log } = prepare("NotFoundPage");

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
