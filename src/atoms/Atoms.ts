/**
 * Atoms properties
 * Need to be share with atoms.less
 */

// ----------------------------------------------------------------------------- BREAKPOINTS

// TODO these values need to be import in a lib responsive manager
// Should probably be an object
export const breakPoint = {
  MOBILE: 320,
  PHABLET: 600,
  TABLET: 768,
  PHLAPTOP: 1024,
  LAPTOP: 1440,
  DESKTOP: 1680
}

// ----------------------------------------------------------------------------- COLORS

export const colors = {
  whiteColor: '#FFF',
  blackColor: '#000',
}

// ----------------------------------------------------------------------------- PROPERTIES

export const properties = {
  gridNumber: 12,
  columnGrid: window.innerWidth / 12 + 20 / 12
}
