const debug = require("debug")("lib:MetasManager");

/**
 * IMetas properties type
 */
export type TMetaProperty = {
  selectorAttr: string;
  selectorValue: string;
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
  // TODO add favicon
};

/**
 * Default Meta properties
 */
// prettier-ignore
const METAS_PROPERTIES: TMetas = {
  title: [
    { selectorAttr: "property", selectorValue: "og:title", setAttr: "content" },
    { selectorAttr: "name", selectorValue: "twitter:title", setAttr: "content" }
  ],
  description: [
    { selectorAttr: "name", selectorValue: "description", setAttr: "content" },
    { selectorAttr: "property", selectorValue: "og:description", setAttr: "content" },
    { selectorAttr: "name", selectorValue: "twitter:description", setAttr: "content" }
  ],
  imageURL: [
    { selectorAttr: "property", selectorValue: "og:image", setAttr: "content" },
    { selectorAttr: "name", selectorValue: "twitter:image", setAttr: "content" },
    { selectorAttr: "rel", selectorValue: "image_src", setAttr: "href" }
  ],
  siteName: [
    { selectorAttr: "property", selectorValue: "og:site_name", setAttr: "content" },
    { selectorAttr: "name", selectorValue: "twitter:site", setAttr: "content" }
  ],
  pageURL: [
    { selectorAttr: "property", selectorValue: "og:url", setAttr: "content" },
    { selectorAttr: "name", selectorValue: "twitter:url", setAttr: "content" },
    { selectorAttr: "rel", selectorValue: "canonical", setAttr: "href" }
  ],
  author: [
    { selectorAttr: "name", selectorValue: "author", setAttr: "content" }
  ],
  keywords: [
    { selectorAttr: "name", selectorValue: "keywords", setAttr: "content" }
  ]
};

/**
 * MetasManager
 *
 * @description Manage metas document head
 * Default should be define on app initialisation via defaultMetas seter:
 *  MetasManager.defaultMetas = { }
 *
 * Each view should set custom meta value:
 *  MetasManager.inject({ title:"...", ... })
 *
 * In order to use this manager, DOM meta tags need be set in each HTML page:
 *  <title></title>
 *  <meta name="description" content="">
 *  <meta name="author" content="">
 * ...
 *
 */
class MetasManager {
  // --------------------------------------------------------------------------- LOCAL

  /**
   * Default meta properties object
   */
  private readonly _metaProperties: TMetas;

  /**
   * Start constructor
   * @param pMetaProperties
   */
  constructor(pMetaProperties: TMetas = METAS_PROPERTIES) {
    // Set metas properties
    this._metaProperties = pMetaProperties;
    debug("pMetaProperties", pMetaProperties);
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
   * Cleans a string by remplacing the " with the '
   * @param source The original string
   * @return cleanedString The cleaned string
   * @private
   */
  private _cleanMetaString(source: string) {
    return source.replace(/"/g, "'");
  }

  /**
   * Format Meta string
   * @param pMetaValue
   * @param pType
   * @private
   */
  private _formatMeta(pMetaValue: string, pType: string): string {
    return this._cleanMetaString(pMetaValue);
  }

  /**
   * _selectMetaValue
   *
   * Meta priority order:
   * - custom meta
   * - default meta
   * - empty string
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
    if (pCustomMetas?.[pType]) {
      return pCustomMetas[pType];
    }
    // else if default value is set, keep this default value
    else if (pDefaultMetas?.[pType]) {
      return pDefaultMetas[pType];
    }
    // else, there is any custom or default value, return an empty string
    else return "";
  }

  // --------------------------------------------------------------------------- PULBIC API

  /**
   * @name inject
   * @description Inject metas in document <head>
   *
   * @param pCustomMetas
   * @param pDefaultMetas
   * @param pProperties
   */
  public inject(
    pCustomMetas: TMetas = null,
    pDefaultMetas: TMetas = this.defaultMetas,
    pProperties: TMetas = this._metaProperties
  ): void {
    // specific case: update main document title
    const selectDocumentTitle = this._selectMetaValue(
      pCustomMetas,
      pDefaultMetas,
      "title"
    );

    // set in DOM
    document.title = this._cleanMetaString(selectDocumentTitle);

    // loop on pMetas (ex: title, description, imageURL, siteName...)
    Object.keys(pProperties).map((metaType) => {
      // select meta value
      let metaValue = this._selectMetaValue(
        pCustomMetas,
        pDefaultMetas,
        metaType
      );

      // target properties {selector, setAttr} of this specific meta type
      const propertiesMetaType: TMetaProperty[] = pProperties[metaType];

      // for each properties of this specific meta type
      for (let property of propertiesMetaType) {
        // format selector
        const selector = `[${property.selectorAttr}="${property.selectorValue}"]`;

        // if tag element exist
        if (document.head.querySelector(selector) !== null) {
          // set meta in tag element
          document.head
            .querySelector(selector)
            .setAttribute(
              property.setAttr,
              this._formatMeta(metaValue, metaType)
            );
        }
        // else, return do nothing
        else return;
      }
    });
  }
}

// export with new instance
export default new MetasManager();
