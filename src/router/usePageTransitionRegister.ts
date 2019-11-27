import { useLayoutEffect } from "react";
import { prepare } from "../helpers/prepare";
import RouterRegister from "./PageTransitionrRegister";

// prepare
const { log } = prepare("usePageTransitionRegister");

/**
 * @name usePageTransitionRegister
 */
const usePageTransitionRegister = (
  componentName: string,
  playInPromiseHandler: () => Promise<any>,
  playOutPromiseHandler?: () => Promise<any>
) => {
  useLayoutEffect(() => {
    // register transtions
    RouterRegister.register(
      componentName,
      playInPromiseHandler,
      playOutPromiseHandler
    );
  }, []);
};

export default usePageTransitionRegister;
