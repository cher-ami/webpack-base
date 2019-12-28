/**
 * Check if an element is wisible in window
 * @param pElement
 */
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { useWindowSize } from "./useWindowSize";
import { EListener, useBoundingClientRect } from "./useBoundingClientRect";

/**
 * Check if a component is visible in viewport
 * @param {MutableRefObject<HTMLElement>} pRef: component to check
 * @param {number} pOffset: Define an offset before the component being in window
 * @param {boolean} pToogleVisibility: Repeat the check visibility even if element if already pass to true
 */
export function useIsInViewport(
  pRef: MutableRefObject<HTMLElement>,
  pToogleVisibility: boolean = false,
  pOffset: number = 0
): boolean {
  // get offset top du composant
  const refRect = useBoundingClientRect(pRef, EListener.ON_SCROLL_AND_RESIZE);
  // get window size
  const windowSize = useWindowSize();
  // get visible state component in window
  const [isVisible, setIsVisible] = useState<boolean>(false);

  /**
   * Is in Viewport
   * @param pRefRect
   * @param pWindowSize
   * @param pOffset
   */
  const isInViewPort = (
    pRefRect: ClientRect,
    pWindowSize: { width: number; height: number },
    pOffset: number
  ): boolean => {
    // check
    if (!pRefRect || !pWindowSize) return;

    // TRAITER LE TOP IMAGE
    const topIsVisible =
      // si le top image est visible au dessus du bottom viewport
      pRefRect.top < pWindowSize.height - pOffset &&
      // et que ce meme top est visible en dessous du top viewport
      pRefRect.top > 0;

    // TRAITER LE BOTTOM IMAGE
    const bottomIsVisible =
      // si le bottom image est visible au dessus du bottom viewport
      pRefRect.bottom < pWindowSize.height &&
      // et que le bottom image est visible en dessous du top
      pRefRect.bottom - pOffset > 0;

    // TRAITER LE CAS OU L'IMAGE EST PLUS GRAND OU EGALE AU VIEWPORT
    const isCropOrEgalOnTopAndBottom =
      // si le top est au dessus du viewport
      pRefRect.top <= 0 &&
      // et si le bottom est en meme temps en dessous
      pRefRect.bottom >= pWindowSize.height;

    //console.log({topIsVisible, bottomIsVisible, isCropOrEgalOnTopAndBottom})

    // return boolean result, is part of element visible on window ?
    return topIsVisible || bottomIsVisible || isCropOrEgalOnTopAndBottom;
  };

  /**
   *  Update state depend of offset element
   */
  const updateState = useCallback(
    (
      pRefRect: ClientRect,
      pWindowSize: { width: number; height: number },
      pOffset: number
    ): void => {
      // if is in viewport
      if (isInViewPort(pRefRect, pWindowSize, pOffset)) {
        // the element is visible
        setIsVisible(true);
        // if element is not in viewport
      } else {
        // if element is already visible and toggle option is not activated, exit
        if (isVisible && !pToogleVisibility) return;
        // the element isn't visible in the window
        setIsVisible(false);
      }
    },
    [refRect, windowSize]
  );

  // Start check
  useEffect(() => updateState(refRect, windowSize, pOffset), [
    refRect,
    windowSize
  ]);

  // return
  return isVisible;
}
