import { useEffect, useState } from "react";

/**
 * @name useRouteTransition
 */
const useRouteTransition = (
  routeName: string,
  playInHandler: () => void,
  playOutHandler?: () => void
) => {
  const [playIn, setPlayIn] = useState([]);

  /**
   *
   */
  useEffect(() => {});
};

export default useRouteTransition;
