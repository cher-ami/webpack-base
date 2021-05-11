/**
 * @credits Original work by Alexis Bouhet - https://zouloux.com
 */

/**
 * WARNING, HAZARDOUS NUCLEAR NOT SO TESTED WEAPON.
 * USE WITH CAUTION.
 * Dirty hack from http://stackoverflow.com/questions/5680013/how-to-be-notified-once-a-web-font-has-loaded
 * Preload fonts. It will add text node to body with wanted font. Invisible.
 * Then it goes nasty but also clever :) It will check for any size change. If a change is detected, then the font is loaded.
 * TODO : Change the way of targeting fonts : Use a class, cleaner since the name of the font is typed into CSS.
 * @param fonts List of fonts name to load.
 * @param callback Called when all fonts are loaded.
 */
export const preloadFont = (fonts: string[], callback: () => void): void => {
  // number of loaded fonts
  let loadedFonts = 0

  function fontLoaded() {
    if (++loadedFonts == fonts.length) {
      callback()
    }
  }

  for (let i = 0, l = fonts.length; i < l; ++i) {
    ;(function (font) {
      let node = document.createElement("span")
      // Characters that vary significantly among different fonts
      node.innerHTML = "giItT1WQy@!-/#"
      // Visible - so we can measure it - but not on the screen
      node.style.position = "absolute"
      node.style.left = "-10000px"
      node.style.top = "-10000px"
      // Large font size makes even subtle changes obvious
      node.style.fontSize = "300px"
      // Reset any font properties
      node.style.fontFamily = "sans-serif"
      node.style.fontVariant = "normal"
      node.style.fontStyle = "normal"
      node.style.fontWeight = "normal"
      node.style.letterSpacing = "0"
      document.body.appendChild(node)

      // Remember width with no applied web font
      let width = node.offsetWidth

      node.style.fontFamily = font

      let interval
      let checked = 0
      function checkFont() {
        //console.log("CHECK", node.offsetWidth, width);

        // Compare current width with original width
        if (node.offsetWidth != width || ++checked > 200 /* 10s */) {
          node.parentNode.removeChild(node)
          node = null

          if (interval) {
            window.clearInterval(interval)
            fontLoaded()
          }
        }
      }

      interval = window.setInterval(checkFont, 100)
    })(fonts[i])
  }
}
