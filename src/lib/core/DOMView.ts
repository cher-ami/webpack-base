/**
 * This is a simple DOM based view.
 * @credits Original work by Alexis Bouhet - https://zouloux.com
 */
export class DOMView {
  // ------------------------------------------------------------------------- DOM

  // Starting node of our component
  $root: HTMLElement

  // ------------------------------------------------------------------------- INIT

  /**
   * DOMView constructor.
   * Set component's root. If not defined, can still be targeted trough targetRoot middleWare.
   * @param $pRoot Component's root. If not defined, can still be targeted trough targetRoot middleWare.
   * @param pAutoInit Will launch init phase if true. Else, child component have to init manually.
   */
  constructor($pRoot: HTMLElement = null, pAutoInit = true) {
    // Set root from parameter
    if ($pRoot != null) {
      this.$root = $pRoot
    }

    // Initialise if needed
    pAutoInit && this.init()
  }

  /**
   * Start init sequence
   */
  protected init() {
    this.prepareDependencies()
    this.beforeInit()
    this.prepareNodes()
    this.initComponents()
    this.prepareEvents()
    this.afterInit()
  }

  /**
   * Prepare dependencies with DependencyManager
   */
  protected prepareDependencies() {}

  /**
   * Middleware called just before init sequence
   */
  protected beforeInit() {}

  /**
   * Prepare node targeting from $root
   */
  protected prepareNodes() {}

  /**
   * Init components
   */
  protected initComponents() {}

  /**
   * Prepare events
   */
  protected prepareEvents() {}

  /**
   * Middleware called just after init sequence
   */
  protected afterInit() {}
}
