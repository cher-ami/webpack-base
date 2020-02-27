import css from "./NotFoundPage.module.less";
import React, { useRef } from "react";
import { usePageRegister } from "@common/lib/router/usePageRegister";

interface IProps {
  classNames?: string[];
}

// prepare
const componentName = "NotFoundPage";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name NotFoundPage
 */
const NotFoundPage = (props: IProps) => {
  // get root ref
  const rootRef = useRef<HTMLDivElement>(null);

  // -------------------–-------------------–-------------------–--------------- REGISTER PAGE

  /**
   * playIn page transition
   * (remove this exemple if not use)
   */
  const playIn = (): Promise<any> => {
    return new Promise(resolve => resolve());
  };

  /**
   * playOut page transition
   * (remove this exemple if not use)
   */
  const playOut = (): Promise<any> => {
    return new Promise(resolve => resolve());
  };

  // register page
  usePageRegister({ componentName, rootRef, playIn, playOut });

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div className={css.Root} ref={rootRef}>
      {componentName}
    </div>
  );
};

export default NotFoundPage;
