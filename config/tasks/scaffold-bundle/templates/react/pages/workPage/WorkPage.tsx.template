import css from "./WorkPage.module.less";
import React, { useRef } from "react";
import { usePageRegister } from "@common/lib/router/usePageRegister";

interface IProps {
  parameters: any;
}

// prepare
const componentName = "WorkPage";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name WorkPage
 */
const WorkPage = (props: IProps) => {
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

  /**
   * Register page for ViewStack
   * NOTE: each page of ViewStack need to be register to work.
   * Minimal register should be: usePageRegister({ componentName, rootRef });
   * (remove playIn and playOut if not use)
   */
  usePageRegister({ componentName, rootRef, playIn, playOut });

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div className={css.Root} ref={rootRef}>
      {componentName}
      <div>{props.parameters?.slug}</div>
    </div>
  );
};

export default WorkPage;
