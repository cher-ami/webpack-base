const debug = require("debug")("front:GlobalConfig");

/**
 * Add your custom properties here
 */
export class GlobalConfigProperties {
  version: string;
  baseUrl: string;
  routerBaseUrl: string;
}

/**
 * @name GlobalConfig
 */
class GlobalConfig extends GlobalConfigProperties {
  constructor() {
    super();
    debug("GlobalConfig", this);
  }

  /**
   * Inject arbitrary properties inside this object
   */
  public inject(pProps: any) {
    if (pProps == null || typeof pProps !== "object") return;
    for (let i in pProps) {
      this[i] = pProps[i];
    }
  }
}

export default new GlobalConfig();
