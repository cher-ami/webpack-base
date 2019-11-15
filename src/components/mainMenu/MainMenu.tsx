import "./MainMenu.less";
import React from "react";
import { Link } from "wouter";
import { Routes } from "../../router/Routes";
import { classBlock, className } from "../../helpers/className";

interface IProps {
  classNames?: string[];
}

// component name
const component: string = "MainMenu";

/**
 * @name MainMenu
 */
function MainMenu(props: IProps) {
  // --------------------------------------------------------------------------- PREPARE RENDER

  // prepare class block string
  const block = classBlock([component, props.classNames]);

  // --------------------------------------------------------------------------- RENDER

  return (
    <nav className={block}>
      <ul className={className(component, "items")}>
        {Routes.filter(el => el.showInMenu).map((el, i) => (
          <li className={className(component, "item")} key={i}>
            <Link href={el.path} children={el.name} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MainMenu;
