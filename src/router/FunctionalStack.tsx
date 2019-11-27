import React, { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "wouter";
import { getRoute } from "./RoutesList";
import RouterRegister from "./RouterRegister";
import { prepare } from "../helpers/prepare";
import { useAsyncLayoutEffect } from "../hooks/useAsyncEffect";

// prepare
const { component, log } = prepare("FunctionalStack");

/**
 * @name FunctionalStack
 */
function FunctionalStack() {
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
   * Router STACK
   */
  // get old route
  const [oldRoute, setOldRoute] = useState<{
    component: ReactNode;
    componentName: string;
  }>(null);
  // get current route
  const [currentRoute, setCurrentRoute] = useState<{
    component: ReactNode;
    componentName: string;
  }>(null);

  // seter les routes dans le state au changement de location
  useLayoutEffect(() => {
    // l'ancienne current devient la old route
    setOldRoute(currentRoute);

    // FIXME si location contient un param URL type :id, getRoute ne retourn pas le composant
    // FIXME car il match la location (ex: blog/article) avec le path (ex: blog/:id)
    // la current route dépend de la location
    const { component, componentName } = getRoute({ pLocation: location });
    // seter la route courante dans le state currentRoute
    setCurrentRoute({ component, componentName });
  }, [location]);

  /**
   * Transition
   */
  // playIn Current route
  // prettier-ignore
  useAsyncLayoutEffect(async () => {
    // check
    if (!currentRoute || !currentRoute?.componentName) return;
    log("currentRoute", currentRoute);

    // anim playIn
    await RouterRegister.routesTransitions?.[currentRoute.componentName]?.playIn?.();

    // afficher un log à la fin de l'animation
    await log("currentRoute playIn Complete");
  }, [currentRoute]);

  // playOut Old route
  // prettier-ignore
  useAsyncLayoutEffect(async () => {
    // check
    if (!oldRoute || !oldRoute?.componentName) return;
    log("oldRoute", oldRoute);

    // anim playOut
    await RouterRegister.routesTransitions?.[oldRoute.componentName]?.playOut?.();

    // killer oldRoute
    setOldRoute(null)

    await log("oldRoute playOut Complete");
  }, [oldRoute]);

  // ----------------–----------------–----------------–----------------–------- RENDER

  /**
   * DOM Route depend of state
   */
  let Old: any = oldRoute?.component;
  let Current: any = currentRoute?.component;

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
