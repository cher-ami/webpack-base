import {
  useState,
  useRef,
  useEffect,
  MutableRefObject,
  useCallback
} from "react";

/**
 * Listener choice
 */
export enum EListener {
  // get offset component only on init
  ON_INIT,
  // get on init + scroll
  ON_SCROLL,
  // get on init + resize
  ON_RESIZE,
  // get on init + scroll + resize
  ON_SCROLL_AND_RESIZE
}

/**
 * useBoundingclientRect hook
 * @param  {MutableRefObject<HTMLElement>} pRef The React pRef whose ClientRect is needed
 * @param {EListener} pListener
 * @return ClientRect
 */
export function useBoundingClientRect(
  pRef: MutableRefObject<HTMLElement>,
  pListener: EListener = EListener.ON_INIT
): ClientRect | DOMRect | null {
  // define offset state
  const [rect, setRect] = useState<ClientRect | DOMRect | null>(null);

  /**
   * getBoundingClientRect properties
   */
  const getBoundingClientRect = useCallback((): ClientRect | DOMRect | null => {
    // if pRef exist
    return pRef?.current?.getBoundingClientRect();
  }, [pRef]);

  /**
   *  update offset state
   */
  const update = (): void => {
    // set new offset
    setRect(getBoundingClientRect());
  };

  // each time pRef change
  useEffect(() => {
    // check if ref exist
    if (!pRef.current) return;
    // update offset state
    update();

    // listen on resize
    if (
      pListener === EListener.ON_RESIZE ||
      pListener === EListener.ON_SCROLL_AND_RESIZE
    ) {
      window.addEventListener("resize", update);
    }
    // listen on scroll
    if (
      pListener === EListener.ON_SCROLL ||
      pListener === EListener.ON_SCROLL_AND_RESIZE
    ) {
      document.addEventListener("scroll", update);
    }

    // stop listen
    return () => {
      if (
        pListener === EListener.ON_RESIZE ||
        pListener === EListener.ON_SCROLL_AND_RESIZE
      ) {
        window.removeEventListener("resize", update);
      }
      if (
        pListener === EListener.ON_SCROLL ||
        pListener === EListener.ON_SCROLL_AND_RESIZE
      ) {
        document.removeEventListener("scroll", update);
      }
    };
  }, [pRef.current]);

  // get initial mount
  const initialMount = useRef(true);

  useEffect(() => {
    // update offset state
    if (initialMount.current) {
      update();
      initialMount.current = false;
    }
  }, []);

  // return offset
  return rect;
}
