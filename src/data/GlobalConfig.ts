const debug = require("debug")("front:GlobalConfig");

/**
 * Add your custom properties here
 */
export class GlobalConfigProperties {
  // Compiled version of the app, from package.json and process.env
  version: string;
  // env (staging, qa, production...)
  env: string;
  // Base URL
  baseUrl: string;
  // Router base URL
  routerBaseUrl: string;
  // Root node where the app DOM will be append
  root: HTMLElement;
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
    // Check if props are injectable
    if (pProps == null || typeof pProps !== "object") return;

    // Inject props
    for (let i in pProps) {
      this[i] = pProps[i];
    }
  }
}

// export with singleton
export default new GlobalConfig();
