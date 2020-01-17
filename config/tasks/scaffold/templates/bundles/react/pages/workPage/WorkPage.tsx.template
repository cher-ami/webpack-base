import css from "./WorkPage.module.less";
import React, { useRef } from "react";
import { usePageRegister } from "../../common/lib/router/usePageRegister";
import Metas from "../../common/lib/react-components/metas";
import { prepare } from "../../common/helpers/prepare";
import { merge } from "../../common/lib/helpers/classNameHelper";

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

  // register page
  usePageRegister({ componentName, rootRef });

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
