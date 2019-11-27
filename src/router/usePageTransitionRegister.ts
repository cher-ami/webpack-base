import { useLayoutEffect } from "react";
import { useLocation } from "wouter";
import { prepare } from "../helpers/prepare";
import RouterRegister from "./PageTransitionrRegister";

// prepare
const { component, log } = prepare("useRouteRegister");

/**
 * @name usePageTransitionRegister
 */
const usePageTransitionRegister = (
  componentName: string,
  playInPromiseHandler: () => Promise<any>,
  playOutPromiseHandler?: () => Promise<any>
) => {
  // get current location
  const [location] = useLocation();

  useLayoutEffect(() => {
    // register transtions
    RouterRegister.register(
      componentName,
      playInPromiseHandler,
      playOutPromiseHandler
    );
  }, [location]);
};

export default usePageTransitionRegister;
