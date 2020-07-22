import { MutableRefObject, useEffect, useLayoutEffect, useMemo } from "react";
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
  // page is ready state allow to now if page is ready (data fetched or whatever...)
  isReady?: boolean;
  // wait bool isReady pass to true via promise
  waitIsReadyPromise?: () => Promise<any>;
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
  list: {} as TPagesRegister,
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
  playIn = () => Promise.resolve(),
  playOut = () => Promise.resolve(),
  rootRef,
  actionName = Router.DEFAULT_ACTION_NAME,
  stackName = Router.DEFAULT_STACK_NAME,
  actionParameters,
  isReady = true,
}: TPageRegisterObject) {
  /**
   * Page is ready deffered promise
   * Create a promise and get resolve anywhere
   */
  const readyDeferred = useMemo(() => {
    log("creating deffered");
    const deffered: any = {};
    deffered.promise = new Promise((resolve) => {
      deffered.resolve = resolve;
    });
    return deffered;
  }, []);

  // resolve deferred if isReady param is true
  useEffect(() => {
    if (isReady) {
      readyDeferred?.resolve("readyDeferred Promise is resolved!");
    }
  }, [isReady]);

  /**
   * Register pages before render
   */
  useLayoutEffect(() => {
    // Build a new page register object
    const newPageRegister = {
      [currentPath]: {
        componentName,
        playIn,
        playOut,
        rootRef,
        stackName,
        actionName,
        actionParameters,
        isReady,
        waitIsReadyPromise: () => readyDeferred.promise,
      },
    };

    // merge new object on page register object
    pagesRegister.register = {
      ...pagesRegister.list,
      ...newPageRegister,
    };

    // log the page register list
    log(`pages register list`, pagesRegister.list);
  }, []);
}
