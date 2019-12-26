/**
 * Atoms properties
 * Need to be share with atoms.less
 */

// ----------------------------------------------------------------------------- BREAKPOINTS

export const breakPoint = {
  MOBILE: 320,
  PHABLET: 600,
  TABLET: 768,
  PHLAPTOP: 1024,
  LAPTOP: 1440,
  DESKTOP: 1680
};

// ----------------------------------------------------------------------------- COLORS

export const colors = {
  whiteColor: "#FFF",
  blackColor: "#000"
};

// ----------------------------------------------------------------------------- PROPERTIES

export const grid = {
  // column
  "total-column-number": 12,
  // gutter
  "gutter-size": 30,
  "gutter-size-mobile": 30,
  // maximum grid size
  "max-width-grid": 1024
};

// ----------------------------------------------------------------------------- FINAL

/**
 * Final Atom export
 */
export const _Atoms = {
  breakPoint,
  colors,
  grid
};
