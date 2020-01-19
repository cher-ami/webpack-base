import { prepare } from "../helpers/prepare";
const { log } = prepare("GlobalConfig");

/**
 * Add your custom properties here
 */
export class GlobalConfigProperties {
  // Compiled version of the app, from package.json and process.env
  version: string;
  // env (staging, qa, production...)
  env: string;
  // Base URL
  baseURL: string;
  // Router base url
  routerBaseURL: string;
  // Root node where the app DOM will be append
  root: HTMLElement;
  // Locale translation code
  locale: string;
  // site data
  appData: any;
}

/**
 * @name GlobalConfig
 */
class GlobalConfig extends GlobalConfigProperties {
  // --------------------------------------------------------------------------- METHODS

  /**
   * Log Global config
   */
  public log = () => log(this);

  // ------------------------------------------------------------------------- INJECT

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
