import { useEffect, useState } from "react";

/**
 * Mouse Position object
 */
export interface IMouseCoordinated {
  top: number;
  left: number;
}

/**
 * Return mouse position in document
 * @param pElement
 */
export function useMousePosition(pElement): IMouseCoordinated {
  // ------------------------------------------------------------------------- STATE

  // seter la position de la souris
  const [mousePosition, setMousePosition] = useState<IMouseCoordinated>({
    top: 0,
    left: 0
  });

  // ------------------------------------------------------------------------- HANDLER

  /**
   * Get de la position de la souris au mouse Event
   * @param pEvent
   */
  function mouseMoveHandler(pEvent): void {
    // la poistion relative du cursor
    setMousePosition({
      top: pEvent.pageY - pElement.current.offsetTop,
      left: pEvent.pageX - pElement.current.offsetLeft
    });
  }

  // ------------------------------------------------------------------------- LIFECYCLE

  useEffect(() => {
    // écouter le mouseMove
    document.addEventListener("mousemove", mouseMoveHandler);

    // killer l'écoute
    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  // retourner la position de la souris
  return mousePosition;
}
