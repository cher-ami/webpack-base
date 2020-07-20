import { useEffect, useRef } from "react";

/**
 * Do something only on component is update
 * @param pUpdateAction
 * @param pUpdateParam
 */
export function useDidUpdate(
  pUpdateAction: () => void,
  pUpdateParam: Array<any>
): void {
  // initial reference
  const initialRef = useRef(true);

  // listen to initial Action
  useEffect(() => {
    if (initialRef.current) {
      // set to false the initial ref
      initialRef.current = false;
    } else {
      // do something
      pUpdateAction();
    }
  }, pUpdateParam);
}
