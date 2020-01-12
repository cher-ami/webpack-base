import React, { useLayoutEffect, useState } from "react";

/**
 * use Document Scroll Top
 * return {number}
 */
export function useDocumentScrollTop(): number {
  // init set scroll top position
  const [scrollTopPosition, setScrollTopPosition] = useState<number>(
    (window.pageYOffset || document.documentElement.scrollTop) -
      (document.documentElement.clientTop || 0)
  );

  useLayoutEffect(() => {
    // Scroll Handler
    const scrollHandler = () => {
      // set new document scroll Top (distance px scroll to top document )
      setScrollTopPosition(
        (window.pageYOffset || document.documentElement.scrollTop) -
          (document.documentElement.clientTop || 0)
      );
    };

    // start first
    scrollHandler();

    // listen scroll event
    document.addEventListener("scroll", scrollHandler);
    return () => {
      // stop to listen scroll event
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  // return scroll top position
  return scrollTopPosition;
}
