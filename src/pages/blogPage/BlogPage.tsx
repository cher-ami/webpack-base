import "./BlogPage.less";
import React, { useEffect, useRef } from "react";
import { TweenLite } from "gsap";
import RouterRegister from "../../router/RouterRegister";

interface IProps {
  classNames?: string[];
}

const component: string = "BlogPage";

/**
 * @name BlogPage
 */
function BlogPage(props: IProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anim = () => {
      TweenLite.to(rootRef.current, 1, { y: 100 });
    };
    RouterRegister.registerPlayIn(anim);
  });

  return (
    <div ref={rootRef} className={component}>
      {component}
    </div>
  );
}

export default BlogPage;
