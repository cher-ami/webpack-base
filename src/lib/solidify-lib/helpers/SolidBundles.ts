import { App } from "../core/App";

/**
 * App bundle static require
 */
export interface IBundleRequire {
  // If this bundle has been required
  required?: boolean;

  // Name of the bundle
  name: string;

  // Main class of the app bundle
  main: any;
}

/**
 * App bundles static require list interface
 */
export interface IBundleRequireList {
  // FuseBox package manager app bundles paths
  paths: string[];

  // App bundle static requires statements for quantum mode
  requires: () => IBundleRequire[];
}

/**
 * App Bundle main abstract constructor interface
 */
export interface AppMain {
  new (): App;
}

/**
 * App Bundle loaded handler interface
 */
export interface AppBundleLoadedHandler {
  (pAppMain: any): void;
}

/**
 * Solid App Bundle Manager.
 * Load and check loading of app bundles.
 */
export class SolidBundles {
  // Global variable name for app bundle loading handler
  protected static WINDOW_LOADED_HANDLER = "SolidBundleLoaded";

  // Global variable name for FuseBox package manager in dev mode
  protected static WINDOW_FUSE_BOX_NAME = "FuseBox";

  // Global variable name for this class
  protected static WINDOW_SOLID_BUNDLES_NAME = "SolidBundles";

  // App bundles require list
  protected static __bundlesRequireList: IBundleRequireList;

  // Waiting bundle loaded handler
  protected static __waitingHandlers: {
    [index: string]: AppBundleLoadedHandler;
  } = {};

  // Register of all loaded app bundle mains
  protected static __appBundleMains: { [index: string]: any } = {};

  // Count of app bundle inits, to catch HMR reloads
  protected static __appBundleInitCount: { [index: string]: number } = {};

  /**
   * Override base to load bundles.
   * If null, will use process.env['BASE'] from deployed config.
   */
  static get base(): string {
    return this.__base;
  }
  static set base(value: string) {
    this.__base = value;
  }
  protected static __base: string;

  /**
   * Init Solid Bundle manager.
   * @param pBundleRequireList Compiled require list from fuse.
   */
  static init(pBundleRequireList: IBundleRequireList) {
    // Check if handler exists
    if (!(SolidBundles.WINDOW_LOADED_HANDLER in window)) {
      throw new Error(
        `Create a global handler named ${SolidBundles.WINDOW_LOADED_HANDLER} into your html markup to init app bundles.`
      );
    }

    // Register require list
    SolidBundles.__bundlesRequireList = pBundleRequireList;

    // Expose and override public API
    window[SolidBundles.WINDOW_SOLID_BUNDLES_NAME] = SolidBundles;

    // Check bundles from require list
    SolidBundles.checkBundles();
  }

  /**
   * Method to check if every app bundles are loaded.
   * This loop will run until every bundles are loaded.
   */
  static checkBundles() {
    // Loaded bundles list
    let bundles: IBundleRequire[];

    // In production mode, we use quantum to resolve
    // So require will not do XHR
    if (process.env.NODE_ENV === "production") {
      // Get bundle through require
      bundles = SolidBundles.__bundlesRequireList.requires();
    }

    // In dev mode, we uses FuseBox, which tries to resolves through XHR
    else {
      // Get bundles from FuseBox paths
      bundles = SolidBundles.__bundlesRequireList.paths.map(bundlePath =>
        // If FuseBox has the package, import it, so we avoid an XHR
        window[SolidBundles.WINDOW_FUSE_BOX_NAME].exists(bundlePath)
          ? window[SolidBundles.WINDOW_FUSE_BOX_NAME].import(bundlePath)
          : // Else, set to null so next operations will consider this bundle as missing
            null
      );
    }

    // Browse bundles
    bundles.map(bundle => {
      // If this bundle is loaded and was never required
      if (bundle != null && !("required" in bundle)) {
        // Set it as required
        bundle.required = true;

        // Register this main for this name as a loaded app bundle
        SolidBundles.__appBundleMains[bundle.name] = bundle.main;

        // Expose its name and main bundle
        window[SolidBundles.WINDOW_LOADED_HANDLER](bundle.name, bundle.main);

        // If we have a waiting loaded handler
        if (bundle.name in SolidBundles.__waitingHandlers) {
          // Call handler and pass bundle main
          SolidBundles.__waitingHandlers[bundle.name](bundle.main);

          // Remove waiting handler
          delete SolidBundles.__waitingHandlers[bundle.name];
        }
      }
    });
  }

  /**
   * Load an app bundle.
   * @param {string} pBundleName Name of the app bundle to load.
   * @param {string} pLoadedHandler Called when app bundle is loaded. First argument is app class.
   * @param {boolean} pExtremeCacheBusting Enable extreme cache busting by asking timestamp as a parameter. Otherwise, will use bundle version.
   * @param {boolean} pLoadCSSToo Also add a link tag for bundle CSS
   */
  static loadBundle(
    pBundleName: string,
    pLoadedHandler?: AppBundleLoadedHandler,
    pExtremeCacheBusting = false,
    pLoadCSSToo = false
  ) {
    // Get base path and bundle path from injected env
    const basePath = this.__base === null ? process.env["BASE"] : this.__base;
    const bundlePath = process.env["BUNDLE_PATH"];

    // Generate the cache busting extension with date for extreme mode or bundle version for regular mode
    const cacheExtension = pExtremeCacheBusting
      ? Date.now()
      : process.env["VERSION"];

    // Load CSS first if asked
    if (pLoadCSSToo) {
      // Create style tag with attributes and append it to the body
      const styleTag = document.createElement("link");
      styleTag.setAttribute("rel", "stylesheet");
      styleTag.setAttribute(
        "href",
        `${basePath}${bundlePath}${pBundleName}.css?${cacheExtension}`
      );
      document.head.appendChild(styleTag);
    }

    // Create script tag with attributes and append it to the body
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute(
      "src",
      `${basePath}${bundlePath}${pBundleName}.js?${cacheExtension}`
    );
    document.head.appendChild(scriptTag);

    // Register handler
    if (pLoadedHandler != null) {
      SolidBundles.__waitingHandlers[pBundleName] = pLoadedHandler;
    }
  }

  /**
   * Get an app main from it's app bundle name
   * @param {string} pAppBundleName Bundle name to get, without extension.
   * @param {string} pThrow If we throw errors or return null. Default throws.
   * @returns {any}
   */
  static getAppBundleMainFromName(pAppBundleName: string, pThrow = true): any {
    // If this app bundle main does not exists
    if (!(pAppBundleName in SolidBundles.__appBundleMains)) {
      if (pThrow) {
        throw new Error(
          `App bundle ${pAppBundleName} does not exists or is not loaded yet.`
        );
      } else return null;
    }

    // If this app bundle has no main
    if (SolidBundles.__appBundleMains[pAppBundleName] === false) {
      if (pThrow) {
        throw new Error(
          `This app bundle (${pAppBundleName}) does not have Main file.`
        );
      } else return null;
    }

    // Returns app bundle main
    return SolidBundles.__appBundleMains[pAppBundleName];
  }

  /**
   * Register an app init and get count.
   * This is to avoid double init of bundles when Hot Module Reloaded is restarting app.
   * @param {string} pAppBundleName App bundle name to count.
   */
  static registerAppBundleInit(pAppBundleName: string) {
    // Init counter
    if (!(pAppBundleName in SolidBundles.__appBundleInitCount)) {
      SolidBundles.__appBundleInitCount[pAppBundleName] = 0;
    }

    // Increment counter
    else {
      SolidBundles.__appBundleInitCount[pAppBundleName]++;
    }
  }

  /**
   * Get app bundle init count to know if we are in first init or Hot Module Reloading.
   * @param {string} pAppBundleName App bundle name to count.
   * @returns {number} Total init count. If 0, this is not an Hot Module Reloading.
   */
  static getAppBundleInitCount(pAppBundleName: string): number {
    return SolidBundles.__appBundleInitCount[pAppBundleName];
  }
}
