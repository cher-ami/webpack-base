import React, { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useRouter } from "wouter";
import { getRoute } from "./RoutesList";

function FunctionalStack() {
  // get current location
  const [location, setLocation] = useLocation();

  /**
   * Increment counter
   */
  const [count, setCount] = useState(0);
  useEffect(() => setCount(count + 1), [location]);

  /**
   * Router
   */
  // get old route
  const [oldRoute, setOldRoute] = useState<{ component: ReactNode }>(null);
  // get current route
  const [currentRoute, setCurrentRoute] = useState<{ component: ReactNode }>(
    null
  );

  useLayoutEffect(() => {
    /**
     * TODO besoin de récupérer les animations d'entrée et de sortie de chaque Route, comment ?
     *
     */
    // l'ancienne current devient la old route
    if (count > 0) setOldRoute(currentRoute);
    // la current route dépend de la location
    // FIXME si location contient un param URL type :id, getRoute ne retourn pas le composant
    // FIXME car il match la location (ex: blog/article) avec le path (ex: blog/:id)
    setCurrentRoute({
      component: getRoute({ pLocation: location })?.component
    });
    // animer...
  }, [location]);

  /**
   * DOM Route depend of state
   */
  let Old: any = oldRoute?.component;
  let Current: any = currentRoute?.component;

  /**
   * Render
   */
  return (
    <div>
      {Old && <Old key={count - 1} />}
      {Current && <Current key={count} />}
    </div>
  );
}

export default FunctionalStack;
