import { prepareComponent } from "../helpers/prepareComponent";
const { log } = prepareComponent("GlobalConfig");

/**
 * Add your custom properties here
 */
export class GlobalConfigProperties {
  // Compiled version of the app, from package.json and process.env
  version: string;
  // env (staging, qa, production...)
  env: string;
  // App URL
  appURL: string;
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
 * Singleton Config class
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
