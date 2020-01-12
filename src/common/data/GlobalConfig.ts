import { prepareComponent } from "../helpers/prepareComponent";
const { log } = prepareComponent("GlobalConfig");

/**
 * Add your custom properties here
 */
export class GlobalConfigProperties {
  // Compiled version of the app, from package.json and process.env
  version: string;
  // env
  env: string;
  // Base http path to access to the app, from process.env
  base: string;
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
