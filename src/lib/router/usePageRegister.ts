import { MutableRefObject, useLayoutEffect } from "react";
import debug from "debug";
import { IActionParameters, Router } from "./Router";
const log = debug("lib:usePageRegister");

/**
 *  Pages register type
 */
export type TPagesRegister = {
  [currentPage: string]: TPageRegisterObject;
};

/**
 * Single page register object type
 */
export type TPageRegisterObject = {
  componentName: string;
  playIn: () => Promise<any>;
  playOut: () => Promise<any>;
  rootRef: MutableRefObject<any>;
  actionName?: string;
  actionParameters?: IActionParameters;
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
  actionName,
  actionParameters
}: TPageRegisterObject) => {
  /**
   * pageIsAlreadyRegister
   * @description Check if a page is already register in object
   * @param page
   * @param name
   */
  const pageIsAlreadyRegister = (
    page = pagesRegister.list,
    name: string
  ): boolean => Object.keys(page).some(el => el === name);

  // --------------------------------------------------------------------------- REGISTER

  /**
   * Register pages before render
   */
  useLayoutEffect(() => {
    // Build a new page register object
    const newPageRegister: TPagesRegister = {
      [Router.currentPath]: {
        componentName,
        playIn,
        playOut,
        rootRef,
        actionName,
        actionParameters
      }
    };

    // merge new object on page register object
    pagesRegister.register = {
      ...pagesRegister.list,
      ...newPageRegister
    };

    // log the page register list
    log(`${componentName} list`, pagesRegister.list);
  }, []);
};
