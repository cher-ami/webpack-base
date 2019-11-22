import React, { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useRouter } from "wouter";
import { getRoute } from "./RoutesList";

function TestFunctionStack() {
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
  const [oldRoute, setOldRoute] = useState<{ instance: ReactNode }>(null);
  const [currentRoute, setCurrentRoute] = useState<{ instance: ReactNode }>(
    null
  );

  useLayoutEffect(() => {
    /**
     * Dans le cas d'un croisement de route
     *
     * TODO besoin de récupérer les animation d'entrée et de sortie de chaque Route
     */

    // l'ancienne current devient la old route
    setOldRoute(currentRoute);
    // la current route dépend de la location
    setCurrentRoute({ instance: getRoute({ pLocation: location })?.component });
    // animer...
  }, [location]);

  /**
   * DOM Route depend of state
   */
  let OldRouteDom: any = oldRoute?.instance;
  let CurrentRouteDom: any = currentRoute?.instance;

  /**
   * Render
   */
  return (
    <div>
      {OldRouteDom && <OldRouteDom key={count - 1} />}
      {CurrentRouteDom && <CurrentRouteDom key={count} />}
    </div>
  );
}

export default TestFunctionStack;
