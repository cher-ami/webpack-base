/**
 * @credits Original by Alexis Bouhet - https://zouloux.com
 */

module.exports = {
  /**
   * Default PNG optimizer config.
   * Used by sprites and imagemin tasks.
   */
  defaultPNGSettings: {
    // Output quality
    quality: "40-80",

    // Dithering level
    //floyd: .5,

    // True to disable dithering
    //nofs: true,

    // Reduce number of color depth bits (from 0 to 4)
    //posterize: 0,

    // Speed trade-off (1: no speed opt, 10: Max speed but lower quality)
    //speed: 3
  },

  /**
   * Override settings for those images.
   * Any PNG image inside this path will have associated settings.
   */
  settingOverride: {
    // Override settings for this component only
    /*
		'main/components/thisComponent/' : {
			quality: '10-20',
			posterize: 4,
		},
		*/
    // Override settings for all pages inside the main bundle
    /*
		'main/pages/' : {
			quality: '80-100',
			nofs: true,
		},
		*/
  },
}
