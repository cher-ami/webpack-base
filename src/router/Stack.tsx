import React, { useState, useEffect, useLayoutEffect } from "react";
import { getCurrentRouteComponent, Routes } from "./Routes";
import { classBlock } from "../helpers/className";
import { useLocation } from "wouter";
import { useDidUpdate } from "../hooks/useDidUpdate";
import { IPage } from "./IPage";

/**
 * Transition between pages.
 */
export enum ETransitionType {
  /**
   * [default]
   * New page will be added and played in after current page is played out.
   */
  PAGE_SEQUENTIAL,

  /**
   * New page will be added on top of current page.
   * Current page will live until new page is played in and current page is played out.
   */
  PAGE_CROSSED,

  /**
   * Transition control is delegated to props.transitionController handler.
   */
  CONTROLLED
}

/**
 * Stack Props
 */
interface IProps {
  classNames?: string[];
  transitionType: ETransitionType;
}

/**
 * DefaultProps
 */
Stack.defaultProps = {
  transitionType: ETransitionType.PAGE_SEQUENTIAL
} as IProps;

// component name
const component: string = "Stack";

let _oldRouteInstance: IPage = null;
let _currentRouteInstance: IPage = null;

/**
 * @name Stack
 */
function Stack(props: IProps) {
  // -
  // get current location
  const [location] = useLocation();

  // Get current route index
  const [currentRouteIndex, setCurrentRouteIndex] = useState<number>(0);

  // get routes properties
  const [oldRoute, setOldRoute] = useState({ instance: null });
  const [currentRoute, setCurrentRoute] = useState({
    instance: null
  });

  useEffect(() => {
    console.log({ _oldRouteInstance, _currentRouteInstance });
  });

  /**
   * Increment index each time location change
   */
  useEffect(() => setCurrentRouteIndex(currentRouteIndex + 1), [location]);

  /**
   * PlayIn Route on FirstMount
   */
  useEffect(() => {
    // save new currentRoute in currentRoute State
    setCurrentRoute({
      instance: getCurrentRouteComponent(Routes, location)
    });
    // check
    if (_currentRouteInstance && _currentRouteInstance.playIn) {
      _currentRouteInstance.playIn().then(() => {
        console.log("elelelele");
      });
    }
  }, []);

  /**
   * PAGE_SEQUENTIAL
   */
  useDidUpdate(() => {
    if (props.transitionType === ETransitionType.PAGE_SEQUENTIAL) {
      setOldRoute({ instance: currentRoute.instance });
      setCurrentRoute({ instance: null });
    }
  }, [location]);

  useDidUpdate(() => {
    if (props.transitionType === ETransitionType.PAGE_SEQUENTIAL) {
      if (!_oldRouteInstance || !_oldRouteInstance.playOut) return;
      // play out old route
      _oldRouteInstance.playOut().then(() => {
        // reset old route state
        setOldRoute({ instance: null });
        // save new currentRoute in currentRoute State
        setCurrentRoute({
          instance: getCurrentRouteComponent(Routes, location)
        });
        if (_currentRouteInstance && _currentRouteInstance.playIn) {
          _currentRouteInstance.playIn();
        }
      });
    }
  }, [oldRoute]);

  /**
   * PAGE_CROSSED
   */
  useDidUpdate(() => {
    if (props.transitionType === ETransitionType.PAGE_CROSSED) {
      setOldRoute({ instance: currentRoute.instance });
      setCurrentRoute({ instance: getCurrentRouteComponent(Routes, location) });
    }
  }, [location]);

  useDidUpdate(() => {
    if (props.transitionType === ETransitionType.PAGE_CROSSED) {
      if (_oldRouteInstance && _oldRouteInstance.playOut) {
        // play out old route
        _oldRouteInstance.playOut().then(() => {
          // reset old route state
          setOldRoute({ instance: null });
        });
      }
      if (_currentRouteInstance && _currentRouteInstance.playIn) {
        _currentRouteInstance.playIn();
      }
    }
  }, [currentRoute]);

  // /**
  //  * Set routes on their respective state if location change
  //  */
  // useDidUpdate(() => {
  //   // save old currentRoute as oldRoute if exist
  //   setOldRoute({ instance: currentRoute.instance });
  //
  //   if (props.transitionType === ETransitionType.PAGE_SEQUENTIAL) {
  //     // reset current Route
  //     setCurrentRoute({ instance: null });
  //   }
  //
  //   if (props.transitionType === ETransitionType.PAGE_CROSSED) {
  //     // save new currentRoute in currentRoute State
  //     setCurrentRoute({
  //       instance: getCurrentRouteComponent(Routes, location)
  //     });
  //     if (_currentRouteInstance && _currentRouteInstance.playIn) {
  //       _currentRouteInstance.playIn();
  //     }
  //   }
  // }, [location]);

  // /**
  //  * if OLD route state change
  //  */
  // useDidUpdate(() => {
  //   //  playOut old Route
  //   if (!_oldRouteInstance || !_oldRouteInstance.playOut) return;
  //   // play out old route
  //   _oldRouteInstance.playOut().then(() => {
  //     // reset old route state
  //     setOldRoute({ instance: null });
  //
  //     // if sequential page transition, we change current route state a
  //     if (props.transitionType === ETransitionType.PAGE_SEQUENTIAL) {
  //       // save new currentRoute in currentRoute State
  //       setCurrentRoute({
  //         instance: getCurrentRouteComponent(Routes, location)
  //       });
  //
  //       if (!_currentRouteInstance || !_currentRouteInstance.playIn) return;
  //       _currentRouteInstance.playIn();
  //     }
  //   });
  // }, [oldRoute]);
  //
  // /**
  //  * If CURRENT route state change
  //  */
  // useDidUpdate(() => {
  //   if (props.transitionType === ETransitionType.PAGE_CROSSED) {
  //     if (!_currentRouteInstance || !_currentRouteInstance.playIn) return;
  //     _currentRouteInstance.playIn();
  //   }
  // }, [currentRoute]);

  // --------------------------------------------------------------------------- RENDER

  // get route for JSX instance
  let OldRouteDom = oldRoute.instance === null ? null : oldRoute.instance;
  let CurrentRouteDom =
    currentRoute.instance === null ? null : currentRoute.instance;

  return (
    <div className={classBlock([component, props.classNames])}>
      {OldRouteDom !== null && (
        <OldRouteDom
          key={currentRouteIndex - 1}
          // ref={r => _setOldRouteInstance(r)}
          ref={r => ((_oldRouteInstance as any) = r)}
        />
      )}
      {CurrentRouteDom !== null && (
        <CurrentRouteDom
          key={currentRouteIndex}
          ref={r => ((_currentRouteInstance as any) = r)}
        />
      )}
    </div>
  );
}

export default Stack;
