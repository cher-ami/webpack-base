import css from "./HomePage.module.less";
import React, { useRef } from "react";
import { usePageRegister } from "../../common/lib/router/usePageRegister";
import Metas from "../../common/lib/react-components/metas";
import PageTransitionHelper from "../../common/helpers/PageTransitionHelper";
import { prepare } from "../../common/helpers/prepare";
import { merge } from "../../common/lib/helpers/classNameHelper";

interface IProps {
  classNames?: string[];
}

// prepare
const { componentName, log } = prepare("HomePage");

/**
 * @name HomePage
 */
const HomePage = (props: IProps) => {
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
    </div>
  );
};

export default HomePage;
