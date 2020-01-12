/**
 * Default play state enum
 */
export enum EPlayState {
  HIDDEN,
  PLAY_OUT,
  PLAY_IN,
  VISIBLE
}

/**
 * Env names list
 */
export enum EEnv {
  DEV = "development",
  STAGING = "staging",
  PROD = "production"
}

// TODO remove, need to be sync via atoms
export const breakPoint = {
  MOBILE: 320,
  PHABLET: 600,
  TABLET: 768,
  PHLAPTOP: 1024,
  LAPTOP: 1440,
  DESKTOP: 1680
};
