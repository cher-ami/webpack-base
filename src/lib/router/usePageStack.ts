import { MutableRefObject, useLayoutEffect } from "react";
import debug from "debug";
import { IActionParameters } from "./Router";
const log = debug("lib:usePageStack");

/**
 *  Pages stack type
 */
export type TPagesStack = {
  [name: string]: TPageStackObject;
};

/**
 * Single page stack object type
 */
export type TPageStackObject = {
  playIn: () => Promise<any>;
  playOut: () => Promise<any>;
  rootRef: MutableRefObject<any>;
  action?: string;
  parameters?: IActionParameters;
};

/**
 * Pages stack accessor
 * All pages stack were store in pagesStack.list
 */
export const pagesStack = {
  set register(pPage: TPageStackObject | Object) {
    this.list = pPage;
  },
  list: {} as TPagesStack
};

/**
 * @name usePageStack
 * @description This Hook allow to register each pageStack
 * This pages stack list can be call from everywhere
 */
export const usePageStack = ({
  componentName,
  playIn,
  playOut,
  rootRef,
  action,
  parameters
}: { componentName: string } & TPageStackObject) => {
  /**
   * @name pageIsAlreadyRegister
   * @description Check if a page is already register in object
   * @param page
   * @param name
   */
  const pageIsAlreadyRegister = (
    page = pagesStack.list,
    name: string
  ): boolean => Object.keys(page).some(el => el === name);

  /**
   * @name registerFn
   * @description Register all new transitions in object
   * @param componentName
   * @param playIn
   * @param playOut
   * @param rootRef
   * @param action
   * @param parameters
   */
  const registerFn = (
    componentName: string,
    playIn: () => Promise<any>,
    playOut: () => Promise<any>,
    rootRef: MutableRefObject<any>,
    action?: string,
    parameters?: IActionParameters
  ): void => {
    // build page object
    const newPageRegister: TPagesStack = {
      [componentName]: {
        playIn,
        playOut,
        rootRef,
        action,
        parameters
      }
    };
    // merge new object on page stack object
    pagesStack.register = {
      ...pagesStack.list,
      ...newPageRegister
    };
  };

  // --------------------------------------------------------------------------- REGISTER

  /**
   * Register pages stack before render
   */
  useLayoutEffect(() => {
    registerFn(componentName, playIn, playOut, rootRef, action, parameters);
    log("pagesStackList", pagesStack.list);
  }, []);
};
