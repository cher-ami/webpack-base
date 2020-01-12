import { useState, useEffect, useLayoutEffect } from "react";

/**
 * Use State With Callback
 * @param pInitialState
 * @param pCallback
 */
export function useStateWithCallback(pInitialState, pCallback) {
  // init state
  const [state, setState] = useState(pInitialState);

  // exectute callback in use effect update on state or callback was changed
  useEffect(() => pCallback(state), [state, pCallback]);

  // return getter and setter state array
  return [state, setState];
}

/**
 * Use State With Callback Instant
 * @param pInitialState
 * @param pCallback
 */
export const useStateWithCallbackInstant = (pInitialState, pCallback) => {
  // init state
  const [state, setState] = useState(pInitialState);

  // exectute callback in use layoutEffect update on state or callback was changed
  useLayoutEffect(() => pCallback(state), [state, pCallback]);

  // return getter and setter state array
  return [state, setState];
};
