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
    image: [
      "meta[property='og:image'",
      "name='twitter:image'"
    ],
    siteName: [
      "property='og:site_name'",
      "name='twitter:site'"
    ],
    pageURL: [
      "property='og:url'",
      "name='twitter:url'",
      "link[rel='canonical'" // attention: url and not content attr
    ]
  };

  /**
   * Inject title in appropiate meta tags
   * @param pTitle
   * @param pProperties
   */
  function injectTitle(pTitle: string, pProperties: string[]) {
    // check
    if (!props?.title) return;

    // update main document title
    if (document.title !== null) document.title = props.title;

    // loop on available properties
    for (let el of pProperties) {
      // check if meta tag with this property exist

      if (document.head.querySelector(`[${el}]`) === null) return;

      // if exist, inject title insite.
      document.head.querySelector(`[${el}]`).setAttribute("content", pTitle);
    }
  }

  /**
   * Inject Description
   * @param pDescription
   * @param pProperties
   */
  function injectDescription(pDescription: string, pProperties: string[]) {
    // loop on available properties
    for (let el of pProperties) {
      // check if meta tag with this property exist

      if (document.head.querySelector(`[${el}]`) === null) return;

      // if exist, inject title insite.
      document.head
        .querySelector(`[${el}]`)
        .setAttribute("content", pDescription);
    }
  }

  function injectImage(pImageURL: string, pProperties: string[]) {
    // TODO
  }

  function injectSiteName(pSiteName: string, pProperties: string[]) {
    // TODO
  }

  function injectPageURL(pPageURL: string, pProperties: string[]) {}

  // treat props here

  /**
   * inject all metas
   */
  function injectAllMetas({
    title,
    description,
    imageURL,
    siteName,
    pageURL
  }: IProps) {
    // FIXME ces fonctions font toutes la meme chose, généraliser le tout

    // inject title
    injectTitle(title, metaProperties.title);

    // inject description
    injectDescription(description, metaProperties.description);
  }

  /**
   * Final
   */
  useEffect(() => injectAllMetas(props), [props]);

  // --------------------------------------------------------------------------- RENDER

  return null;
}

export default Metas;
