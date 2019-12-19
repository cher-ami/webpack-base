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
  "total-column-number-mobile": 4,

  // gutter
  "gutter-size": 30,
  "gutter-size-px": "35px",

  "gutter-size-mobile": 30,
  "gutter-size-mobile-px": "30px",

  // maximum grid size
  "max-width-grid": 1024,
  "max-width-grid-px": "1024px"
};

// ----------------------------------------------------------------------------- FINAL

/**
 * Final Atom export
 */
export const Atoms = {
  breakPoint,
  colors,
  grid
};
