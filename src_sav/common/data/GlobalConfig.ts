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
  data: any;
}

/**
 * Singleton Config class
 */
export class GlobalConfig extends GlobalConfigProperties {
  // ------------------------------------------------------------------------- SINGLETON

  // Singleton
  protected static __instance: GlobalConfig;

  /**
   * Get GlobalConfig singleton instance.
   */
  public static get instance(): GlobalConfig {
    // Create instance
    if (GlobalConfig.__instance == null) {
      GlobalConfig.__instance = new GlobalConfig();
    }

    // Return singleton instance
    return GlobalConfig.__instance;
  }

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
