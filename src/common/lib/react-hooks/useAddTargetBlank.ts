import { MutableRefObject, useEffect } from "react";

/**
 * Add Target Blank à tous les liens du contenu
 */
export function useAddTargetBlank(pRef: MutableRefObject<any>) {
  useEffect(() => {
    // target children links of specific DOM node
    const links = pRef?.current?.querySelectorAll("a[href]");
    // set target="_blank" attribute to each of them
    if (links !== null) {
      links.forEach((link) => link.setAttribute("target", "_blank"));
    }
  }, []);
}
