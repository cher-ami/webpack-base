import css from "./WorkPage.module.less";
import React, { ForwardedRef, forwardRef, useRef } from "react";
import { useStack } from "@cher-ami/router";

interface IProps {
  params: {
    id: string;
  };
}

const componentName = "WorkPage";
const debug = require("debug")(`front:${componentName}`);

/**
 * @name WorkPage
 */
const WorkPage = forwardRef((props: IProps, handleRef: ForwardedRef<any>) => {
  const rootRef = useRef<HTMLDivElement>(null);

  /**
   * playIn page transition
   * (remove this example if not use)
   */
  const playIn = (): Promise<void> => Promise.resolve();

  /**
   * playOut page transition
   * (remove this example if not use)
   */
  const playOut = (): Promise<void> => Promise.resolve();

  /**
   * Handle page for Stack
   * Minimal arguments should be: usePageRegister({ componentName, handleRef, rootRef });
   * (remove playIn and playOut if not use)
   */
  useStack({ componentName, handleRef, rootRef, playIn, playOut });

  debug("props.params", props.params);

  return (
    <div className={css.root} ref={rootRef}>
      {componentName} witn ID <em>{props.params?.id}</em>
    </div>
  );
});

WorkPage.displayName = componentName;
export default WorkPage;
