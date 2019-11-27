import { useEffect, useLayoutEffect } from "react";

/**
 * Use effect with Promise
 * @param effect
 * @param inputs
 */
export function useAsyncEffect(effect, inputs?: any[]) {
  useEffect(() => {
    effect();
  }, inputs);
}

/**
 * Use Layout Effect with promise
 * @param effect
 * @param inputs
 */
export function useAsyncLayoutEffect(effect, inputs?: any[]) {
  useLayoutEffect(() => {
    effect();
  }, inputs);
}
