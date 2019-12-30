import { MutableRefObject, useLayoutEffect } from "react";
import debug from "debug";
import { IActionParameters } from "./Router";
const log = debug("lib:usePageRegister");

/**
 *  Pages register type
 */
export type TPagesRegister = {
  [name: string]: TPageRegisterObject;
};

/**
 * Single page register object type
 */
export type TPageRegisterObject = {
  playIn: () => Promise<any>;
  playOut: () => Promise<any>;
  rootRef: MutableRefObject<any>;
  action?: string;
  parameters?: IActionParameters;
};

/**
 * Pages register accessor
 * All pages properties were store in "pagesRegister.list"
 */
export const pagesRegister = {
  set register(pPage: TPageRegisterObject | Object) {
    this.list = pPage;
  },
  list: {} as TPagesRegister
};

/**
 * @name usePageRegister
 * @description This Hook allow to register each page properties
 * This pages stack list can be call from everywhere
 */
export const usePageRegister = ({
  componentName,
  playIn,
  playOut,
  rootRef,
  action,
  parameters
}: { componentName: string } & TPageRegisterObject) => {
  /**
   * @name pageIsAlreadyRegister
   * @description Check if a page is already register in object
   * @param page
   * @param name
   */
  const pageIsAlreadyRegister = (
    page = pagesRegister.list,
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
    const newPageRegister: TPagesRegister = {
      [componentName]: {
        playIn,
        playOut,
        rootRef,
        action,
        parameters
      }
    };
    // merge new object on page register object
    pagesRegister.register = {
      ...pagesRegister.list,
      ...newPageRegister
    };
  };

  // --------------------------------------------------------------------------- REGISTER

  /**
   * Register pages register before render
   */
  useLayoutEffect(() => {
    registerFn(componentName, playIn, playOut, rootRef, action, parameters);
    log(`${componentName} list`, pagesRegister.list);
  }, []);
};
