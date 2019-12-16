export class ModuleUtils {
  /**
   * Target the requirejs lib on global scope
   */
  static REQUIRE = window["requirejs"];

  /**
   * All defined and not loaded modules names in requirejs
   */
  static getRegistryNames(): { [index: string]: any } {
    return ModuleUtils.REQUIRE.s.contexts["_"].registry;
  }

  /**
   * All defined and loaded modules names in requirejs
   */
  static getLoadedModulesNames(): { [index: string]: any } {
    return ModuleUtils.REQUIRE.s.contexts["_"].defined;
  }

  /**
   * A proxy method to the require global function from requirejs.
   * In sync mode, all loaded have to be preloaded once in async mode.
   * @param pDependencyName Name of dependency needed
   */
  static requireSync(pDependencyName: string): any {
    return ModuleUtils.REQUIRE(pDependencyName);
  }

  /**
   * A proxy method to the require global function from requirejs.
   * In async mode, several dependencies can be loaded and module do not have to be preloaded.
   * @param pDependenciesNames List of dependencies needed
   * @param pHandler Called when modules are ready. Every module required is a new argument.
   */
  static requireAsync(
    pDependenciesNames: string[],
    pHandler: (...args) => void
  ): void {
    ModuleUtils.REQUIRE(pDependenciesNames, pHandler);
  }

  /**
   * Instantiate a class with its reference and an arguments list.
   * @param pClassReference Reference to the object to instantiate.
   * @param pConstructorArguments List of arguments passed as parameters to the constructor.
   * @returns the instance of the instantiated object.
   */
  static dynamicNew(pClassReference: any, pConstructorArguments: any[]): any {
    // Dynamic wrapped constructor to get arguments
    function DynamicClass(): void {
      // Call the constructor with arguments
      pClassReference.apply(this, pConstructorArguments);
    }

    // Apply prototype to the wrapped constructor
    DynamicClass.prototype = pClassReference.prototype;

    // Return the instance of the wrapped constructor
    return new DynamicClass();
  }

  /**
   * Preload requirejs modules so they can be accessed synchronously.
   * @param pModulesPath Base path of modules to load (for ex: "src/components/" will preload all modules declared with a name starting with "src/components/")
   * @param pLoadedHandler Called when all modules are preloaded. List of modules passed in argument.
   */
  static preloadModules(
    pModulesPath: string[],
    pLoadedHandler: (pLoadedModules: string[]) => void
  ): void {
    // Get the requirejs registry
    let registry: { [index: string]: any } = this.getRegistryNames();

    // And the loaded modules list from requirejs
    let loadedModules: { [index: string]: any } = this.getLoadedModulesNames();

    // Modules loaded and to load
    let modulesToLoad: string[] = [];
    let totalLoadedModules: number = 0;

    // Browse path we have to load
    for (let modulePathIndex in pModulesPath) {
      // EBrowser modules list
      for (let moduleName in registry) {
        if (
          // If our module name start with a needed module path
          moduleName
            .toLowerCase()
            .indexOf(pModulesPath[modulePathIndex].toLowerCase()) != -1 &&
          // And if this module is not already loaded
          !(moduleName in loadedModules)
        ) {
          // Add the module name to the list of modules we have to load
          modulesToLoad.push(moduleName);

          // Use the require proxy to preload
          this.requireAsync([moduleName], () => {
            // When loaded, count it
            totalLoadedModules++;

            // Callback when we have every modules
            if (totalLoadedModules == modulesToLoad.length) {
              pLoadedHandler(modulesToLoad);
            }
          });
        }
      }
    }

    // If we don't have any module
    if (modulesToLoad.length == 0) {
      pLoadedHandler(modulesToLoad);
    }
  }
}
