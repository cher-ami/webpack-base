import S from "./MainMenu.module.less";
import React from "react";
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

  //const C = (pClasses:string[]) =>
  // TODO : créer une function "combine" className avec un test sur le merge d'array

  // --------------------------------------------------------------------------- RENDER

  return (
    <nav className={[S.MainMenu, ...props.classNames].join(" ")}>
      <ul className={S.items}>
        {routes.map((el, i) => {
          const parameters = {
            id: el?.parameters?.id,
            slug: el?.parameters?.slug
          };
          return (
            <li key={i} className={S.item}>
              <a
                className={[S.link, i == 0 ? S.link_blue : null]
                  .filter(v => v)
                  .join(" ")}
                href={Router.generateURL({
                  page: el.page,
                  parameters: el.parameters ? parameters : null
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
