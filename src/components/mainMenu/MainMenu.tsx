import "./MainMenu.less";
import React from "react";
import { classBlock, className } from "../../helpers/className";
import { Router } from "../../lib/solidify/navigation/Router";
import { prepareComponent } from "../../helpers/prepareComponent";
import { routes } from "../../Main";

interface IProps {
  classNames?: string[];
}

// Prepare
const { component, log } = prepareComponent("MainMenu");

/**
 * @name MainMenu
 */
function MainMenu(props: IProps) {
  // --------------------------------------------------------------------------- PREPARE RENDER

  // --------------------------------------------------------------------------- RENDER

  return (
    <nav className={classBlock([component, props.classNames])}>
      <ul className={className(component, "items")}>
        {routes.map((el, i) => {
          const parameters = {
            id: el?.parameters?.id,
            slug: el?.parameters?.slug
          };
          return (
            <li key={i}>
              <a
                href={Router.generateURL({
                  page: el.page,
                  parameters: el.parameters ? parameters : null
                })}
                //href={el.url}
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
