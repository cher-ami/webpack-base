import { useLayoutEffect } from "react";
import { useLocation } from "wouter";
import { prepare } from "../helpers/prepare";
import RouterRegister from "./RouterRegister";

// prepare
const { component, log } = prepare("useRouteRegister");

/**
 * @name useRouteRegister
 */
const useRouteRegister = (
  componentName: string,
  playInPromiseHandler: () => Promise<any>,
  playOutPromiseHandler?: () => Promise<any>
) => {
  // get current location
  const [location] = useLocation();

  useLayoutEffect(() => {
    // register transtions
    RouterRegister.registerTransitions(
      componentName,
      playInPromiseHandler,
      playOutPromiseHandler
    );
  }, [location]);
};

export default useRouteRegister;
