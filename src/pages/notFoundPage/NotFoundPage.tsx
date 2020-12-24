import css from "./NotFoundPage.module.less";
import React, { useRef } from "react";
import { usePageRegister } from "../../lib/router/usePageRegister";

interface IProps {}

const componentName = "NotFoundPage";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name NotFoundPage
 */
const NotFoundPage = (props: IProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  // -------------------–-------------------–-------------------–--------------- REGISTER PAGE

  /**
   * playIn page transition
   * (remove this example if not use)
   */
  const playIn = (): Promise<void> => {
    return Promise.resolve();
  };

  /**
   * playOut page transition
   * (remove this example if not use)
   */
  const playOut = (): Promise<void> => {
    return Promise.resolve();
  };

  // register page
  usePageRegister({ componentName, rootRef, playIn, playOut });

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div className={css.root} ref={rootRef}>
      {componentName}
    </div>
  );
};

export default NotFoundPage;
