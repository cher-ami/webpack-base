import React, { useEffect } from "react";
import { prepareComponent } from "../../helpers/prepareComponent";

interface IProps {
  title?: string;
  description?: string;
  imageURL?: string;
  siteName?: string;
  pageURL?: string;
}

// prepare
const { log } = prepareComponent("Metas");

/**
 * @name Metas
 */
function Metas(props: IProps) {
  // --------------------------------------------------------------------------- PREPARE

  // define meta title list
  // prettier-ignore
  const metaProperties = {
    title: [
      "property='og:title'",
      "name='twitter:title'"
    ],
    description: [
      "name=description",
      "property='og:description'",
      "name='twitter:description'"
    ],
    imageURL: [
      "property='og:image'",
      "name='twitter:image'"
    ],
    siteName: [
      "property='og:site_name'",
      "name='twitter:site'"
    ],
    pageURL: [
      "property='og:url'",
      "name='twitter:url'",
      "rel='canonical'" // attention: url and not content attr
    ]
  };

  /**
   * inject all metas
   */
  function injectAllMetas(pMetas: IProps, pProperties) {
    // update main document title
    if (document.title !== null) document.title = props.title;

    // loop each metas type
    for (let metaType of Object.keys(pMetas)) {
      // for each metatype, loop on available properties
      for (let property of pProperties[metaType]) {
        // check if meta tag with this property exist
        if (document.head.querySelector(`[${property}]`) === null) return;

        // exception
        if (property === "rel='canonical'") {
          // if exist, inject title insite.
          document.head
            .querySelector(`[${property}]`)
            .setAttribute("href", pMetas[metaType]);
        } else {
          // if exist, inject title insite.
          document.head
            .querySelector(`[${property}]`)
            .setAttribute("content", pMetas[metaType]);
        }
      }
    }
  }

  /**
   * Final
   */
  useEffect(() => injectAllMetas(props, metaProperties), []);

  // --------------------------------------------------------------------------- RENDER

  return null;
}

export default Metas;
