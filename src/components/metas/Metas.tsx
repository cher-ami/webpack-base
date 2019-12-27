import React, { useEffect } from "react";

interface IProps {
  title?: string;
  description?: string;
  imageURL?: string;
  siteName?: string;
  pageURL?: string;
}

/**
 * @name Metas
 */
// prettier-ignore
function Metas(props: IProps) {

  // --------------------------------------------------------------------------- PREPARE

  // define meta title list

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
      "rel='canonical'"
    ]
  };

  /**
   * inject all metas
   */
  function injectAllMetas(pMetas: IProps, pProperties)
  {
    // update main document title
    if (document.title !== null) document.title = props.title;

    // loop each metas type
    for (let metaType of Object.keys(pMetas))
    {
      // for each metatype, loop on available properties
      for (let property of pProperties[metaType])
      {
        // check if meta tag with this property exist
        if (document.head.querySelector(`[${property}]`) === null) return;

        // exception if exist, inject title insite
        if (property === "rel='canonical'")
        {
          document.head
            .querySelector(`[${property}]`)
            .setAttribute("href", pMetas[metaType]);
        }
        else
        {
          // if exist, inject title insite.
          document.head
            .querySelector(`[${property}]`)
            .setAttribute("content", pMetas[metaType]);
        }
      }
    }
  }

  /**
   * Update meta after render
   */
  useEffect(() => injectAllMetas(props, metaProperties), []);

  // --------------------------------------------------------------------------- RENDER

  // return nothing
  return null;
}

export default Metas;
