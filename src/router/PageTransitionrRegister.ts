import { prepare } from "../helpers/prepare";
// prepare
const { log } = prepare("PageTransitionrRegister");

/**
 * Route transition register Object
 */
export type IPageTransition = {
  [name: string]: {
    playIn: () => Promise<any>;
    playOut?: () => Promise<any>;
  };
};

/**
 * @name PageTransitionrRegister
 *
 */
class PageTransitionrRegister {
  /**
   * Store routes transition in an object
   * And access it from outside
   */
  public transitions: IPageTransition = {};

  /**
   * @name register
   * @param name
   * @param playIn
   * @param playOut
   */
  public register(
    name: string,
    playIn: () => Promise<any>,
    playOut?: () => Promise<any>
  ): void {
    // build route object
    const newRouteRegister: IPageTransition = {
      [name]: {
        playIn,
        playOut
      }
    };

    // merge objects
    this.transitions = {
      ...this.transitions,
      ...newRouteRegister
    };

    log("is register", this.transitions);
  }

  /**
   * @name routeIsAlreadyRegister
   * @description check if route is already register
   * @param routesTransitions
   * @param name
   */
  private routeIsAlreadyRegister(
    routesTransitions = this.transitions,
    name: string
  ): boolean {
    return Object.keys(routesTransitions).some(el => el === name);
  }
}

// export like singleton
export default new PageTransitionrRegister();
