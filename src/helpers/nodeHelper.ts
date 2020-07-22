import { EEnv } from "../types";

/**
 * Check current env
 * @param pEnv
 */
export const isEnv = (pEnv: EEnv): boolean => process.env.ENV === pEnv;

/**
 * show grid by default
 */
export const showGridByDefault: boolean =
  process.env.SHOW_GRID_BY_DEFAULT === "true";
