import { MutableRefObject, useLayoutEffect } from "react";
import debug from "debug";
import { IActionParameters, Router } from "./Router";
const log = debug("lib:usePageRegister");

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

/**
 * Props type
 */
export type TProps = TPageRegisterObject;

/**
 * Default props
 */
usePageRegister.defaultProps = {
  currentPath: Router.currentPath,
  playIn: () => new Promise(resolve => resolve),
  playOut: () => new Promise(resolve => resolve),
  actionName: Router.DEFAULT_ACTION_NAME,
  stackName: Router.DEFAULT_STACK_NAME
} as TProps;

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
export function usePageRegister(props: TProps) {
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
        componentName: props.componentName,
        playIn: props.playIn,
        playOut: props.playOut,
        rootRef: props.rootRef,
        actionName: props.actionName,
        actionParameters: props.actionParameters
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
