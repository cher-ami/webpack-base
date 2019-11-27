import { useLayoutEffect } from "react";
import { prepare } from "../helpers/prepare";

// prepare
const { log } = prepare("usePageTransitionRegister");

/**
 *  Page transition object type
 */
export type IPageTransition = {
  [name: string]: {
    playIn: () => Promise<any>;
    playOut?: () => Promise<any>;
  };
};

/**
 * Page transition register Object
 * All page transition are store in this object when page declare "usePageTransitionRegister" hook
 */
export let pagesTransitionsList: IPageTransition = {};

/**
 * @name usePageTransitionRegister
 * @description This Hook allow to keep each page transition in "pagesTransitionsList" object
 * This list can be call from everywhere
 */
export const usePageTransitionRegister = (
  componentName: string,
  playInPromiseHandler?: () => Promise<any>,
  playOutPromiseHandler?: () => Promise<any>
) => {
  // --------------------------------------------------------------------------- PREPARE

  /**
   * @name register
   * @description Register all new transitions in object
   * @param componentName
   * @param playIn
   * @param playOut
   */
  const register = (
    componentName: string,
    playIn: () => Promise<any>,
    playOut?: () => Promise<any>
  ): void => {
    // build route object
    const newRouteRegister: IPageTransition = {
      [componentName]: {
        playIn,
        playOut
      }
    };
    // merge new object on page transition object
    pagesTransitionsList = {
      ...pagesTransitionsList,
      ...newRouteRegister
    };
  };

  /**
   * @name pageIsAlreadyRegister
   * @description Check if a page is already register in object
   * @param page
   * @param name
   */
  const pageIsAlreadyRegister = (
    page = pagesTransitionsList,
    name: string
  ): boolean => {
    return Object.keys(page).some(el => el === name);
  };

  // --------------------------------------------------------------------------- REGISTER

  /**
   * Register transition
   */
  useLayoutEffect(() => {
    register(componentName, playInPromiseHandler, playOutPromiseHandler);
  }, []);
};
