/**
 * Default play state enum
 */
export enum EPlayState {
  HIDDEN,
  PLAY_OUT,
  PLAY_IN,
  VISIBLE,
}

/**
 * NodeEnv names list
 * Can be only development (dev-server) or production (build)
 */
export enum ENodeEnv {
  DEV = "development",
  PROD = "production",
}

/**
 * Env names list
 * Name of the specific environment
 * Update this list if you add some env (qa, lamp...)
 */
export enum EEnv {
  DEV = "development",
  STAGING = "staging",
  PROD = "production",
}
