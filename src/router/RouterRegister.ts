import { prepare } from "../helpers/prepare";
const { log } = prepare("RouterRegister");

/**
 * Route transition register Object
 */
export type IRouteTransitionsRegister = {
  [name: string]: {
    playIn: () => void;
    playOut?: () => void;
  };
};

/**
 * @name RouterRegister
 */
class RouterRegister {
  /**
   * Store routes transition in an object
   * And access it from outside
   */
  public routesTransitions: IRouteTransitionsRegister = {};

  /**
   * Register
   * @param name
   * @param playIn
   * @param playOut
   */
  public registerTransitions(
    name: string,
    playIn: () => void,
    playOut?: () => void
  ): void {
    // if already register, do no register it again
    if (this.routeIsAlreadyRegister(this.routesTransitions, name)) return;

    // build route object
    const newRouteRegister: IRouteTransitionsRegister = {
      [name]: {
        playIn
      }
    };

    // merge objects
    this.routesTransitions = {
      ...this.routesTransitions,
      ...newRouteRegister
    };

    log("is register", this.routesTransitions);
  }

  /**
   * @name routeIsAlreadyRegister
   * @description check if route is already register
   * @param routesTransitions
   * @param name
   */
  private routeIsAlreadyRegister(
    routesTransitions = this.routesTransitions,
    name: string
  ): boolean {
    return Object.keys(routesTransitions).some(el => el === name);
  }
}

export default new RouterRegister();
