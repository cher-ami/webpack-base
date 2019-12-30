import { MutableRefObject, useLayoutEffect } from "react";
import debug from "debug";
const log = debug("lib:usePageStack");

/**
 *  Page transition object type
 */
export type IPagesStackList = {
  readonly [name: string]: IPageStackObject;
};

export type IPageStackObject = {
  playIn: () => Promise<any>;
  playOut: () => Promise<any>;
  rootRef: MutableRefObject<any>;
};

/**
 * Page transition register Object
 * All page transition are store in this object when page declare "usePageTransitionRegister" hook
 */
export let pagesStackList: IPagesStackList = {};

/**
 * @name usePageStack
 * @description This Hook allow to keep each page transition in "pagesTransitionsList" object
 * This list can be call from everywhere
 */
export const usePageStack = ({
  componentName,
  playIn,
  playOut,
  rootRef
}: {
  componentName: string;
  playIn: () => Promise<any>;
  playOut: () => Promise<any>;
  rootRef: MutableRefObject<any>;
}) => {
  // --------------------------------------------------------------------------- PREPARE

  /**
   * @name register
   * @description Register all new transitions in object
   * @param componentName
   * @param playIn
   * @param playOut
   * @param rootRef
   */
  const register = (
    componentName: string,
    playIn: () => Promise<any>,
    playOut: () => Promise<any>,
    rootRef: MutableRefObject<any>
  ): void => {
    // build route object
    const newPageRegister: IPagesStackList = {
      [componentName]: {
        playIn,
        playOut,
        rootRef
      }
    };
    // merge new object on page transition object
    pagesStackList = {
      ...pagesStackList,
      ...newPageRegister
    };
  };

  /**
   * @name pageIsAlreadyRegister
   * @description Check if a page is already register in object
   * @param page
   * @param name
   */
  const pageIsAlreadyRegister = (
    page = pagesStackList,
    name: string
  ): boolean => Object.keys(page).some(el => el === name);

  // --------------------------------------------------------------------------- REGISTER

  /**
   * Register pages stack
   */
  useLayoutEffect(() => {
    register(componentName, playIn, playOut, rootRef);

    log("pagesStackList", pagesStackList);
  }, []);
};
