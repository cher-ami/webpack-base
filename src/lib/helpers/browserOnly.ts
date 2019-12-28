/**
 * Browser Only
 * Execute callback only on browser side.
 * It depend of some conditions
 * @param callback
 */
export const browserOnly = (callback: any) => {
  return typeof window !== "undefined" ? callback?.() : null;
};
