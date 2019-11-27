import "./MainMenu.less";
import React, { useLayoutEffect, useRef } from "react";
import { Link } from "wouter";
import { RoutesList } from "../../router/RoutesList";
import { classBlock, className } from "../../helpers/className";
import { TweenLite, Power3 } from "gsap/all";

interface IProps {
  classNames?: string[];
}

// component name
const component: string = "MainMenu";

/**
 * @name MainMenu
 */
function MainMenu(props: IProps) {
  const rootRef = useRef(null);
  // --------------------------------------------------------------------------- PREPARE RENDER

  // prepare class block string
  const block = classBlock([component, props.classNames]);

  // --------------------------------------------------------------------------- RENDER

  return (
    <nav className={block} ref={rootRef}>
      <ul className={className(component, "items")}>
        {RoutesList.filter(el => el?.meta?.showInMenu).map((el, i) => (
          <li className={className(component, "item")} key={i}>
            <Link href={el.as} children={el.meta?.name} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MainMenu;
