import React, { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { getRoute } from "./RoutesList";
import { prepare } from "../helpers/prepare";
import { useAsyncLayoutEffect } from "../hooks/useAsyncEffect";
import { pagesTransitionsList } from "./usePageTransitionRegister";
import { EPlayState } from "../types";

// prepare
const { log } = prepare("RouterStack");

/**
 * Transition between pages.
 */
export enum ETransitionType {
  /**
   * [default]
   * New page will be added and played in after current page is played out.
   */
  SEQUENTIAL,

  /**
   * New page will be added on top of current page.
   * Current page will live until new page is played in and current page is played out.
   */
  CROSSED,

  /**
   * Transition control is delegated to props.transitionController handler.
   */
  CONTROLLED
}

interface IProps {
  // type of transition between oldPage and currentPage
  transitionType?: ETransitionType;

  // current location, use for
  location: string;

  // transition control promise
  // in case transition type is set on "CONTROLLED"
  transitionControl: (
    $oldPage: HTMLElement,
    $newPage: HTMLElement,
    pOldPage,
    pNewPage
  ) => Promise<any>;
}

RouterStack.defaultProps = {
  transitionType: ETransitionType.CROSSED
} as IProps;

/**
 * @name RouterStack
 * @description
 */
function RouterStack(props: IProps) {
  // get current location
  const { location } = props;

  // ----------------–----------------–----------------–----------------–------- COUNTER

  /**
   * Increment counter
   */
  const [count, setCount] = useState<number>(0);
  useEffect(() => setCount(count + 1), [location]);

  // ----------------–----------------–----------------–----------------–------- STACK

  /**
   * Page STACK
   */
  // c old route
  const [oldPage, setOldPage] = useState<{
    component: ReactNode;
    componentName: string;
  }>(null);
  // gsap current route
  const [currentPage, setCurrentPage] = useState<{
    component: ReactNode;
    componentName: string;
  }>(null);

  const [oldPagePlayState, setOldPagePlayState] = useState<EPlayState>(
    EPlayState.HIDDEN
  );
  const [currentPagePlayState, setCurrentPagePlayState] = useState<EPlayState>(
    EPlayState.VISIBLE
  );

  // seter les routes dans le state au changement de location
  useLayoutEffect(() => {
    // l'ancienne current devient la old route
    setOldPage(currentPage);

    // FIXME si location contient un param URL type :id, getRoute ne retourn pas le composant
    // FIXME car il match la location (ex: blog/article) avec le path (ex: blog/:id)
    // la current route dépend de la location
    const { component, componentName } = getRoute({ pLocation: location });
    // seter la route courante dans le state currentPage
    setCurrentPage({ component, componentName });
  }, [location]);

  /**
   * SEQUENCIAL
   *
   *    - get oldPage via currentPage
   *    - vider currentPage
   *
   *    - playOut oldPage
   *
   *    - vider oldPage
   *    - get currentPage (en fonction de location)
   *
   */

  const sequential = async () => {
    // permet de ne pas retrigger à nouveau quand setOldPage(null) est appelé
    if (oldPage === null) return;
    log("oldPage", oldPage);
    // change play out oldPage state
    setOldPagePlayState(EPlayState.PLAY_OUT);
    // anim playOut
    await pagesTransitionsList?.[oldPage?.componentName]?.playOut?.();
    // killer oldPage
    setOldPage(null);
    // change hidden oldPage state
    setOldPagePlayState(EPlayState.HIDDEN);

    log("currentPage", currentPage);
    // change current page play state
    setCurrentPagePlayState(EPlayState.PLAY_IN);
    // anim playIn
    await pagesTransitionsList?.[currentPage?.componentName]?.playIn?.();
    // change current page play state
    setCurrentPagePlayState(EPlayState.VISIBLE);
  };

  /**
   * CROSSED
   *
   *    - get oldPage via currentPage
   *    - get currentPage (en fonction de location)
   *
   *    - playOut oldPage + vider oldPage
   *    - playIn currentPage
   *
   */
  const crossed = async () => {
    // check
    log("oldPage", oldPage);
    // change play out oldPage state
    setOldPagePlayState(EPlayState.PLAY_OUT);
    // anim playOut
    pagesTransitionsList?.[oldPage?.componentName]?.playOut?.().then(() => {
      // killer oldPage
      setOldPage(null);
      // change hidden oldPage state
      setOldPagePlayState(EPlayState.HIDDEN);
    });

    // permet de ne pas retrigger à nouveau quand setOldPage(null) est appelé
    if (oldPage === null) return;
    log("currentPage", currentPage);
    // change current page play state
    setCurrentPagePlayState(EPlayState.PLAY_IN);
    // anim playIn
    pagesTransitionsList?.[currentPage?.componentName]?.playIn?.().then(() => {
      // change current page play state
      setCurrentPagePlayState(EPlayState.VISIBLE);
    });
  };

  /**
   * CONTROLLED
   */
  const controlled = async () => {};

  // start with transition type
  useAsyncLayoutEffect(async () => {
    if (props.transitionType === ETransitionType.SEQUENTIAL) await sequential();
    if (props.transitionType === ETransitionType.CROSSED) await crossed();
    if (props.transitionType === ETransitionType.CONTROLLED) await controlled();
  }, [oldPage, currentPage]);

  // ----------------–----------------–----------------–----------------–------- RENDER

  /**
   * DOM Page depend of state
   */
  let Old: any = oldPage?.component;
  let Current: any = currentPage?.component;

  /**
   * Render
   */
  return (
    <div className={"RouterStack"}>
      {Old && <Old key={count - 1} />}
      {Current && <Current key={count} />}
    </div>
  );
}

export default RouterStack;
