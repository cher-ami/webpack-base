import { MutableRefObject, useLayoutEffect } from "react";
import debug from "debug";
import { IActionParameters, Router } from "./Router";
const log = debug("lib:usePageRegister");

// ----------------------------------------------------------------------------- STRUCT

/**
 *  Pages register type
 */
export type TPagesRegister = {
  [currentPath: string]: TPageRegisterObject;
};

/**
 * Single page register object type
 */
export type TPageRegisterObject = {
  // current route path
  currentPath?: string;
  // component name
  componentName: string;
  // playIn page transition promise hanlder
  // if not set, new promise is set by default
  playIn?: () => Promise<any>;
  // playout page transition promise hanlder
  // if not set, new promise is set by default
  playOut?: () => Promise<any>;
  // component ref
  rootRef: MutableRefObject<any>;
  // stack name
  stackName?: string;
  // action name
  actionName?: string;
  // action parameters
  actionParameters?: IActionParameters;
};

// ----------------------------------------------------------------------------- ACCESSOR

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

// ----------------------------------------------------------------------------- HOOK

/**
 * @name usePageRegister
 * @description This Hook allow to register each page properties
 * This pages stack list can be call from everywhere
 */
export function usePageRegister({
  currentPath = Router.currentPath,
  componentName,
  playIn = () => new Promise(resolve => resolve),
  playOut = () => new Promise(resolve => resolve),
  rootRef,
  actionName = Router.DEFAULT_ACTION_NAME,
  stackName = Router.DEFAULT_STACK_NAME,
  actionParameters
}: TPageRegisterObject) {
  /**
   * Register pages before render
   */
  useLayoutEffect(() => {
    log(Router.DEFAULT_STACK_NAME);

    // Build a new page register object
    const newPageRegister: TPagesRegister = {
      [currentPath]: {
        componentName,
        playIn,
        playOut,
        rootRef,
        stackName,
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
    log(`pages register list`, pagesRegister.list);
  }, []);
}
