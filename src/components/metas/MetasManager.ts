import { prepareComponent } from "../../helpers/prepareComponent";
const { log } = prepareComponent("MetasManager");

/**
 * IMetas interface
 */
export interface IMetas {
  title?: string | string[];
  description?: string | string[];
  imageURL?: string | string[];
  siteName?: string | string[];
  pageURL?: string | string[];
}

/**
 * Default Meta properties
 */
const META_PROPERTIES: IMetas = {
  title: ["property='og:title'", "name='twitter:title'"],
  description: [
    "name=description",
    "property='og:description'",
    "name='twitter:description'"
  ],
  imageURL: ["property='og:image'", "name='twitter:image'"],
  siteName: ["property='og:site_name'", "name='twitter:site'"],
  pageURL: ["property='og:url'", "name='twitter:url'", "rel='canonical'"]
};

/**
 * @name MetasManager
 *
 * @description Manage metas document head
 * Default should be define on app initialisation via defaultMetas seter
 * MetasManager.defaultMetas = { }
 *
 * Each view should set custom meta value
 * MetasManager.inject({ title:"...", ... })
 *
 */
class MetasManager {
  // --------------------------------------------------------------------------- LOCAL

  /**
   * Default meta object
   */
  private readonly _metaProperties: IMetas;

  constructor(pMetaProperties: IMetas = META_PROPERTIES) {
    // Set metas properties
    this._metaProperties = pMetaProperties;
  }

  // --------------------------------------------------------------------------- DEFAULT META

  // store default metas in this variable
  private _defaultMetas: IMetas = null;

  get defaultMetas() {
    return this._defaultMetas;
  }
  set defaultMetas(pDefaultMetas: IMetas) {
    this._defaultMetas = pDefaultMetas;
  }

  // --------------------------------------------------------------------------- PRIVATE

  private _formatMeta(pMeta: string): string {
    // check if there is specific caracters who can break HTML structure

    // if should be URL, check if this is a real one

    return "";
  }

  /**
   *
   * @param pCustomMeta
   * @param pDefaultMeta
   * @private
   */
  private _selectMetaValue(pCustomMeta, pDefaultMeta): string {
    // if a custom metatype is define
    if (pCustomMeta) {
      // keep this custom value
      return pCustomMeta;
      // if there is no custom value and default value is set
    } else if (pDefaultMeta) {
      // keep this default value
      return pDefaultMeta;
      // else, there is any custom value and any default value
    } else {
      // return an empty string
      return "";
    }
  }

  //private _setHead

  // --------------------------------------------------------------------------- PULBIC API

  /**
   * @name inject
   * @description Inject metas in document <head>
   *
   * If no pMetas is returned, set defaultMetas
   * If no defaultMetas exist, return an empty string
   *
   * @param pCustomMetas
   * @param pDefaultMetas
   * @param pProperties
   */
  public inject(
    pCustomMetas: IMetas = null,
    pDefaultMetas: IMetas = this.defaultMetas,
    pProperties: IMetas = this._metaProperties
  ): void {
    // specific case: update main document title
    document.title = this._selectMetaValue(
      pCustomMetas?.title,
      pDefaultMetas?.title
    );

    // loop on pMetas (ex: title, description...)
    for (let metaType of Object.keys(pProperties)) {
      // set a default value;
      let metaValue = this._selectMetaValue(
        pCustomMetas?.[metaType],
        pDefaultMetas?.[metaType]
      );

      log("meta", { metaType, metaValue });

      // for each metatype, loop on available properties
      for (let property of pProperties[metaType]) {
        // check if meta tag with this property exist
        if (document.head.querySelector(`[${property}]`) === null) return;

        // specific case: if exist, inject title inside
        if (property === "rel='canonical'") {
          document.head
            .querySelector(`[${property}]`)
            .setAttribute("href", metaValue);
        } else {
          // if exist, inject title insite.
          document.head
            .querySelector(`[${property}]`)
            .setAttribute("content", metaValue);
        }
      }
    }
  }
}

// export with new instance
export default new MetasManager();
