import "./HomePage.less";
import React, { useEffect, useRef } from "react";
import { TweenLite } from "gsap";
import RouterRegister from "../../router/RouterRegister";
import { prepare } from "../../helpers/prepare";

interface IProps {
  classNames?: string[];
}

const { component, log } = prepare("HomePage");

/**
 * @name HomePage
 */
function HomePage(props: IProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anim = () => {
      TweenLite.to(rootRef.current, 1, { x: 100 });
    };
    RouterRegister.registerPlayIn(anim);
  });

  return (
    <div ref={rootRef} className={component}>
      {component}
    </div>
  );
}

export default HomePage;
