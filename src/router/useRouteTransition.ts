import { MutableRefObject, useLayoutEffect } from "react";
import { useLocation } from "wouter";
import { prepare } from "../helpers/prepare";
import RouterRegister from "./RouterRegister";
const { component, log } = prepare("useRouteTransition");

/**
 * @name useRouteTransition
 */
const useRouteTransition = (
  routeName: string,
  playInPromiseHandler: () => Promise<any>,
  playOutPromiseHandler?: () => Promise<any>
) => {
  // get current location
  const [location, setLocation] = useLocation();

  useLayoutEffect(() => {
    // register transtions
    RouterRegister.registerTransitions(
      routeName,
      playInPromiseHandler,
      playOutPromiseHandler
    );
  }, []);
};

export default useRouteTransition;
