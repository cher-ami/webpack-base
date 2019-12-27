import { prepareComponent } from "../../helpers/prepareComponent";
const { log } = prepareComponent("injectMetas");

/**
 * IMetas interface
 */
export interface IMetas {
  title?: string;
  description?: string;
  imageURL?: string;
  siteName?: string;
  pageURL?: string;
}

interface IMetasProperties {
  title: string[];
  description: string[];
  imageURL: string[];
  siteName: string[];
  pageURL: string[];
}

/**
 * Metas properties
 */
// prettier-ignore
export const metaProperties: IMetasProperties = {
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
 * TODO inject default metas here
 * Transform this file as class with getter and setter
 */
let defaultMetas = {};

/**
 * inject all metas
 */
// prettier-ignore
export function injectMetas(
  pMetas: IMetas,
  pProperties: IMetasProperties,
  pUseDefault: boolean = true
): void
{

  // update main document title
  if (document.title !== null) document.title = pMetas.title;

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
      // TODO set default value if props property is not set
      // TODO set "" if default properties is not set
        document.head
          .querySelector(`[${property}]`)
          .setAttribute("href", pMetas[metaType]);
      }
      else
      {
        // TODO set default value if props property is not set
        // TODO set "" if default properties is not set
        // if exist, inject title insite.
        document.head
          .querySelector(`[${property}]`)
          .setAttribute("content", pMetas[metaType]);
      }
    }
  }
}
