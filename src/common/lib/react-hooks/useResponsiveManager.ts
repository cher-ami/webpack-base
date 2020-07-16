import { useEffect, useState } from "react";

export enum EResponsiveCheckType {
  IS_LESS_THAN,
  IS_MORE_THAN,
}

// store breakpointList on this object
let breakpointsList = {};

/**
 * useResponsiveManager
 * Check if the window size is less than or more than a specific breakpoint on resize.
 * @return boolean
 */
export function useResponsiveManager(
  pCheckType: EResponsiveCheckType,
  pBeakpoints: Object = breakpointsList
): boolean {
  // --------------------------------------------------------------------------- STATES

  // Check if param is less than a kind of breakpoint
  const [isLessThan, setIsLessThan] = useState<boolean>(
    // FIXME
    true
  );

  // --------------------------------------------------------------------------- HANDLERS

  const resizeHandler = () => {
    // When window is resized, set a new boolean to 'isLessThan'
    // FIXME
    setIsLessThan(true);
  };

  // --------------------------------------------------------------------------- RESIZE

  useEffect(() => {
    // Add a resize listner
    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    return () => {
      // Remove the resize listner
      window.removeEventListener("resize", resizeHandler);
    };
  });

  // Return 'isLessThan' boolean value
  return isLessThan;
}
