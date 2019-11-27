import React, { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "wouter";
import { getRoute } from "./RoutesList";
import PageTransitionRegister from "./PageTransitionrRegister";
import { prepare } from "../helpers/prepare";
import { useAsyncLayoutEffect } from "../hooks/useAsyncEffect";

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
  transitionType: ETransitionType;
}

FunctionalStack.defaultProps = {
  transitionType: ETransitionType.SEQUENTIAL
} as IProps;

// prepare
const { component, log } = prepare("FunctionalStack");

/**
 * @name FunctionalStack
 * @description
 */
function FunctionalStack(props: IProps) {
  // get current location
  const [location] = useLocation();

  // ----------------–----------------–----------------–----------------–------- COUNTER

  /**
   * Increment counter
   */
  const [count, setCount] = useState(0);
  useEffect(() => setCount(count + 1), [location]);

  // ----------------–----------------–----------------–----------------–------- STACK

  /**
   * Page STACK
   */
  // get old route
  const [oldPage, setOldPage] = useState<{
    component: ReactNode;
    componentName: string;
  }>(null);
  // get current route
  const [currentPage, setCurrentPage] = useState<{
    component: ReactNode;
    componentName: string;
  }>(null);

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
   * Transition
   */
  // playOut Old route
  // prettier-ignore
  useAsyncLayoutEffect(async () => {
    // check
    if (!oldPage || !oldPage?.componentName) return;
    log("oldPage", oldPage);
    // anim playOut
    await PageTransitionRegister.transitions?.[oldPage.componentName]?.playOut?.();
    // killer oldPage
    setOldPage(null)

    await log("oldPage playOut Complete");
  }, [oldPage]);

  // playIn Current route
  // prettier-ignore
  useAsyncLayoutEffect(async () => {
    // check
    if (!currentPage || !currentPage?.componentName) return;
    log("currentPage", currentPage);

    // anim playIn
    await PageTransitionRegister.transitions?.[currentPage.componentName]?.playIn?.();

    // afficher un log à la fin de l'animation
    await log("currentPage playIn Complete");
  }, [currentPage]);

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
    <div className={component}>
      {Old && <Old key={count - 1} />}
      {Current && <Current key={count} />}
    </div>
  );
}

export default FunctionalStack;
