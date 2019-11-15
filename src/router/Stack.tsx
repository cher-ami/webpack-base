import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  Component,
  RefObject,
  useReducer
} from "react";
import { Routes } from "./Routes";
import { classBlock } from "../helpers/className";

interface IProps {
  classNames?: string[];
  location?: string;
}

// component name
const component: string = "Stack";

/**
 * @name Stack
 */
function Stack(props: IProps) {
  // --------------------------------------------------------------------------- STATE

  // Get current route index
  const [currentRouteIndex, setCurrentRouteIndex] = useState<number>(0);

  // get routes properties
  const [oldRoute, setOldRoute] = useState({ instance: null });
  const [currentRoute, setCurrentRoute] = useState({ instance: null });

  // get route name Uppercase for DOM component who contains route instance
  // prettier-ignore
  // let OldRouteDom = useMemo(()=>
  //   oldRoute && oldRoute.instance === null
  //     ? null
  //     : oldRoute.instance, [oldRoute]);
  // // prettier-ignore
  // let CurrentRouteDom =useMemo(()=>
  //   (currentRoute && currentRoute.instance) === null
  //     ? null
  //     : currentRoute.instance, [currentRoute]);

  let OldRouteDom = oldRoute && oldRoute.instance === null
      ? null
      : oldRoute.instance;
  // prettier-ignore
  let CurrentRouteDom =
    (currentRoute && currentRoute.instance) === null
      ? null
      : currentRoute.instance;

  // Get instance via reference in DOM
  //  let _oldRouteInstance: IPage = useMemo(() => null, [OldRouteDom]);
  //  let _currentRouteInstance: IPage = useMemo(() => null, [CurrentRouteDom]);
  let _oldRouteInstance: IPage = null;
  let _currentRouteInstance: IPage = null;

  // const [oldRoutePlayState, setOldRoutePlayState] = useState<EPlayState>(EPlayState.HIDDEN);
  // const [currentRoutePlayState, setCurrentRoutePlayState] = useState<EPlayState>(EPlayState.PLAY_IN);

  /**
   * Seter les routes dans le state en fonction de la valeur location
   */
  useLayoutEffect(() => {
    // incrémenter l'index
    setCurrentRouteIndex(currentRouteIndex + 1);

    // save old currentRoute as oldRoute if exist
    if (currentRouteIndex > 0) {
      setOldRoute({ instance: currentRoute.instance });
    }

    // Aller taper dans le tableau de route pour savoir quel composant match avec l'url
    const routeComponent = Routes.find(el => el.path === props.location)
      .component;
    // set dans le state courant
    setCurrentRoute({ instance: routeComponent });
  }, [props.location]);

  /**
   * On veut animer si location change
   */
  useEffect(() => {
    if (_oldRouteInstance !== null && _oldRouteInstance.playOut) {
      console.log("_oldRouteInstance", _oldRouteInstance);
      _oldRouteInstance.playOut().then(() => {
        setOldRoute({ instance: null });
      });
    }
  }, [oldRoute]);

  useEffect(() => {
    if (_currentRouteInstance !== null) {
      console.log("_currentRouteInstance", _currentRouteInstance);
      _currentRouteInstance.playIn().then(() => {
        console.log("playIn terminé");
      });
    }
  }, [currentRoute]);

  // --------------------------------------------------------------------------- RENDER

  return (
    <div className={classBlock([component, props.classNames])}>
      {OldRouteDom !== null && (
        <OldRouteDom
          key={currentRouteIndex - 1}
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

/**
 * Allowed playIn / playOut states for IPage
 */
export enum EPagePlayState {
  VISIBLE,
  PLAYING_IN,
  PLAYING_OUT
}

/**
 * Interface for page.
 * It can be triggered from route and managed by an IPageStack
 */
export interface IPage {
  /**
   * Current play in / play out state of the page.
   * Use this state to disable features when animating.
   */
  readonly playState: EPagePlayState;

  /**
   * Action on this page.
   * Have to check props.action and props.params to show proper content.
   */
  action(pActionName: string, pParams: { [index: string]: string | number });

  /**
   * Play intro animation.
   * Have to return a promise when animation is ended.
   */
  playIn(...rest): Promise<any>;

  /**
   * Play outro animation.
   * Have to return a promise when animation is ended.
   */
  playOut(...rest): Promise<any>;
}
