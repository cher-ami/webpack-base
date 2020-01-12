import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Do something only on 1st mount with Effect
 * @param pInitialAction
 */
export function useInitialMount(pInitialAction: () => void): void {
  // initial reference
  const initialRef = useRef(true);

  // listen to initial Action
  useEffect(() => {
    if (initialRef.current) {
      // set to false the initial ref
      initialRef.current = false;

      // do something
      pInitialAction();
    }
  }, []);
}

/**
 * Do something only on 1st mount with layout Effect
 * @param pInitialAction
 */
export function useInitialMountLayout(pInitialAction: () => void): void {
  // initial reference
  const initialRef = useRef(true);

  // listen to initial Action
  useLayoutEffect(() => {
    if (initialRef.current) {
      // set to false the initial ref
      initialRef.current = false;

      // do something
      pInitialAction();
    }
  }, []);
}
