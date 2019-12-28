import { prepareComponent } from "../../helpers/prepareComponent";
const { log } = prepareComponent("MetasManager");

/**
 * IMetas properties type
 */
export type TMetaProperty = {
  selector: string;
  setAttr: string;
};

/**
 * IMetas interface
 */
export type TMetas = {
  title?: string | TMetaProperty[];
  description?: string | TMetaProperty[];
  imageURL?: string | TMetaProperty[];
  siteName?: string | TMetaProperty[];
  pageURL?: string | TMetaProperty[];
  author?: string | TMetaProperty[];
  keywords?: string | TMetaProperty[];
};

/**
 * Default Meta properties
 */
// prettier-ignore
const METAS_PROPERTIES: TMetas = {
  title: [
    { selector: "property='og:title'", setAttr: "content" },
    { selector: "name='twitter:title'", setAttr: "content" }
  ],
  description: [
    { selector: "name='description'", setAttr: "content" },
    { selector: "property='og:description'", setAttr: "content" },
    { selector: "name='twitter:description'", setAttr: "content" }
  ],
  imageURL: [
    { selector: "property='og:image'", setAttr: "content" },
    { selector: "name='twitter:image'", setAttr: "content" }
  ],
  siteName: [
    { selector: "property='og:site_name'", setAttr: "content" },
    { selector: "name='twitter:site'", setAttr: "content" }
  ],
  pageURL: [
    { selector: "property='og:url'", setAttr: "content" },
    { selector: "name='twitter:url'", setAttr: "content" },
    { selector: "rel='canonical'", setAttr: "href" }
  ],
  author: [
    { selector: "name='author'", setAttr: "content" }
  ],
  keywords: [
    { selector: "name='keywords'", setAttr: "content" }
  ]
};

/**
 * MetasManager
 *
 * @description Manage metas document head
 * Default should be define on app initialisation via defaultMetas seter
 * MetasManager.defaultMetas = { }
 *
 * Each view should set custom meta value
 * MetasManager.inject({ title:"...", ... })
 *
 * TODO add option create HTML meta tag if doesn't exist
 *
 */
class MetasManager {
  // --------------------------------------------------------------------------- LOCAL

  /**
   * Default meta object
   */
  private readonly _metaProperties: TMetas;

  /**
   * Start constructor
   * @param pMetaProperties
   */
  constructor(pMetaProperties: TMetas = METAS_PROPERTIES) {
    // Set metas properties
    this._metaProperties = pMetaProperties;
  }

  // --------------------------------------------------------------------------- DEFAULT META

  // store default metas in this variable
  private _defaultMetas: TMetas = null;

  get defaultMetas() {
    return this._defaultMetas;
  }
  set defaultMetas(pDefaultMetas: TMetas) {
    this._defaultMetas = pDefaultMetas;
  }

  // --------------------------------------------------------------------------- PRIVATE

  /**
   * TODO
   * Format Meta string
   * @param pMetaValue
   * @param pType
   * @private
   */
  private _formatMeta(pMetaValue: string, pType: string): string {
    // check if there is specific caracters who can break HTML structure
    // if should be URL, check if this is a real one
    return "";
  }

  /**
   *
   * @param pCustomMetas
   * @param pDefaultMetas
   * @param pType
   * @private
   */
  private _selectMetaValue(
    pCustomMetas: TMetas,
    pDefaultMetas: TMetas,
    pType: string
  ): string {
    // if a custom metatype is define, keep this custom value
    if (pCustomMetas?.[pType]) return pCustomMetas[pType];
    // else if default value is set, keep this default value
    else if (pDefaultMetas?.[pType]) return pDefaultMetas[pType];
    // else, there is any custom or default value, return an empty string
    else return "";
  }

  // --------------------------------------------------------------------------- PULBIC API

  /**
   * @name inject
   * @description Inject metas in document <head>
   *
   * Meta priority order:
   * - custom meta
   * - default meta
   * - empty string
   *
   * @param pCustomMetas
   * @param pDefaultMetas
   * @param pProperties
   * @param pCreateTagElementIfNotExist
   */
  public inject(
    pCustomMetas: TMetas = null,
    pDefaultMetas: TMetas = this.defaultMetas,
    pProperties: TMetas = this._metaProperties,
    pCreateTagElementIfNotExist = true
  ): void {
    // specific case: update main document title
    document.title = this._selectMetaValue(
      pCustomMetas,
      pDefaultMetas,
      "title"
    );

    // loop on pMetas (ex: title, description...)
    for (let metaType of Object.keys(pProperties)) {
      // set a default value;
      let metaValue = this._selectMetaValue(
        pCustomMetas,
        pDefaultMetas,
        metaType
      );

      // target properties {selector, setAttr} of this specific meta type
      const propertiesMetaType: TMetaProperty[] = pProperties[metaType];
      // for each properties of this specific meta type
      for (let property of propertiesMetaType) {
        // if tag element exist
        if (document.head.querySelector(`[${property.selector}]`) !== null) {
          // set meta in tag element
          document.head
            .querySelector(`[${property.selector}]`)
            .setAttribute(`${property.setAttr}`, metaValue);
        }

        // else if option "create tag element" is enable
        else if (pCreateTagElementIfNotExist) {
          /*
          // create meta
          const metaElement = document.createElement("meta");
          // add attr (ex: "content") and set meta value
          metaElement[property.setAttr] = metaValue;
          // append metaElement in head element
          document.getElementsByTagName("head")[0].appendChild(metaElement);
          // create tag element
           */
          log("create tag element");
        }
        // else, return do nothing
        else return;
      }
    }
  }
}

// export with new instance
export default new MetasManager();
