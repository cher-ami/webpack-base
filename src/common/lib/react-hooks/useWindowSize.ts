import { useEffect, useState } from "react";

/**
 * Window size dimensions
 */
interface IWindowSize {
  width: number;
  height: number;
}

/**
 * Window Size
 * return a object with innerDimension object
 * @constructor
 */
export function useWindowSize(): IWindowSize {
  // ------------------------------------------------------------------------- STATES

  // Set a new state
  const [windowSizeState, setWindowSizeState] = useState<IWindowSize>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // ------------------------------------------------------------------------- EFFECTS

  useEffect(() => {
    // action au resize
    const resizeHandler = () => {
      setWindowSizeState({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    resizeHandler();
    // écouter le rezise
    window.addEventListener("resize", resizeHandler);

    return () => {
      // supprimer l'écoute du resize
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  // retourner l'objet
  return windowSizeState;
}
