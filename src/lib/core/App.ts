import { Disposable } from "./Disposable";

export class App extends Disposable {
  // --------------------------------------------------------------------------- INIT

  /**
   * App constructor.
   * Set pInitSequence if this is an Hot Module Reloading trigger.
   * @param {boolean} pInitSequence if true, will go through init method. If false, it will directly go to prepare and ready.
   * @param {any} pParams optionnel parameters, passed to prepare method.
   */
  constructor(pInitSequence: boolean = true, pParams: any = null) {
    // Relay
    super();

    // Prepare app
    this.prepare(pParams);

    // Launch init sequence
    if (pInitSequence) {
      this.initConfig();
      this.initEnv();
      this.initRoutes();
    }

    this.ready();
  }

  /**
   * Prepare App.
   * Can be overridden.
   */
  protected prepare(pParams: any = null) {}

  /**
   * Init configuration.
   * Can be overridden.
   */
  protected initConfig() {}

  // --------------------------------------------------------------------------- ENV

  /**
   * Init env dependent stuff.
   * Can be overridden.
   */
  protected initEnv(): void {}

  // --------------------------------------------------------------------------- ROUTING

  /**
   * Init routes.
   * Can be overridden.
   */
  protected initRoutes(): void {}

  // --------------------------------------------------------------------------- READY

  /**
   * When all the app is ready
   */
  protected ready(): void {}
}
