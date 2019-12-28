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

export default class MetasManager {
  // --------------------------------------------------------------------------- LOCAL

  // metas properties list
  public static metaProperties: IMetasProperties;

  constructor() {
    // set metas properties
    MetasManager.metaProperties = {
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
  }
  // --------------------------------------------------------------------------- SINGLETON

  // singleton
  protected static __instance: MetasManager;

  // instance
  public static get instance(): MetasManager {
    if (MetasManager.__instance == null) {
      MetasManager.__instance = new MetasManager();
    }
    return MetasManager.__instance;
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

  // --------------------------------------------------------------------------- PULBIC API

  /**
   * @name injectMetas
   * @description Inject metas in document <head>
   * If any pMetas is returned, set defaultMetas
   * If no defaultMetas exist, return an empty string
   * @param pMetas
   * @param pDefaultMetas
   * @param pProperties
   */
  public injectMetas(
    pMetas: IMetas | null = null,
    pDefaultMetas: IMetas | null = this._defaultMetas,
    pProperties: IMetasProperties = MetasManager.metaProperties
  ): void {
    // update main document title
    if (document.title !== null) document.title = pMetas.title;

    // pour chaque metas type comme type

    // prettier-ignore
    // loop on pMetas (ex: title, description...)
    for (let metaType of Object.keys(pMetas)) {




      // for each metatype, loop on available properties
      for (let property of pProperties[metaType]) {
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
}
