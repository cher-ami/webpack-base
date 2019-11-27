import { prepare } from "../helpers/prepare";
const { log } = prepare("RouterRegister");

/**
 * Route transition register Object
 */
export type IRouteTransitionsRegister = {
  [name: string]: {
    playIn: () => Promise<any>;
    playOut?: () => Promise<any>;
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
   * @name registerTransitions
   * @param name
   * @param playIn
   * @param playOut
   */
  public registerTransitions(
    name: string,
    playIn: () => Promise<any>,
    playOut?: () => Promise<any>
  ): void {
    // if already register, do no register it again
    //if (this.routeIsAlreadyRegister(this.routesTransitions, name)) return;

    // build route object
    const newRouteRegister: IRouteTransitionsRegister = {
      [name]: {
        playIn,
        playOut
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

// export like singleton
export default new RouterRegister();
