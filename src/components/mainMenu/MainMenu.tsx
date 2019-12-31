import css from "./MainMenu.module.less";
import React, { useRef } from "react";
import { Router } from "../../lib/router/Router";
import { prepareComponent } from "../../helpers/prepareComponent";
import Main from "../../Main";
import { merge } from "../../lib/helpers/classNameHelper";

interface IProps {
  classNames?: string[];
}

// Prepare
const { componentName, log } = prepareComponent("MainMenu");

/**
 * @name MainMenu
 */
function MainMenu(props: IProps) {
  // --------------------------------------------------------------------------- PREPARE RENDER

  const rootRef = useRef(null);

  // --------------------------------------------------------------------------- RENDER

  return (
    <nav className={merge([css.MainMenu, props.classNames])} ref={rootRef}>
      <ul className={css._items}>
        {/* Map availables routes */}
        {Main.routes.map((el, i) => {
          return (
            <li key={i} className={css._item}>
              <a
                className={css._link}
                href={Router.generateURL({
                  page: el.page,
                  parameters: el.parameters
                    ? {
                        slug: el.parameters.slug
                      }
                    : null
                })}
                children={el.metas.name}
                data-internal-link
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MainMenu;
