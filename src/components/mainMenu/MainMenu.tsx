import "./MainMenu.less";
import React, { useRef } from "react";
import { classBlock, className } from "../../helpers/className";
import { prepare } from "../../helpers/prepare";
import { Router } from "../../lib/solidify-lib/navigation/Router";

interface IProps {
  classNames?: string[];
}

// Prepare
const { component, log } = prepare("MainMenu");

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
        <li>
          <a href={`/`} children={"Home"} data-internal-link />
        </li>
        <li>
          <a href={`/blog`} children={"Blog"} data-internal-link />
        </li>
        <li>
          <a
            href={Router.generateURL({
              page: "ArticlePage",
              parameters: {
                id: 5,
                slug: "super-article"
              }
            })}
            data-internal-link
          >
            Article
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default MainMenu;
