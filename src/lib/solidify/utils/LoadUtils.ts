export class LoadUtils {
  /**
   * Preload images from URL's. Will call handler when images are loaded.
   * @param pURLs URL's of images to load
   * @param pHandler Called when all images are loaded. First argument is list of loaded images elements.
   * @param pAppendToBody Will append image to body if true, false by default. Keep image in memory for ever.
   * @param pRemove Will remove image after pre-loaded. false by default. For legacy purpose.
   */
  static preloadImages(
    pURLs: string[],
    pHandler: (pImages: HTMLElement[]) => void,
    pAppendToBody = false,
    pRemove = false
  ): HTMLImageElement[] {
    // Count images
    let total = pURLs.length;
    let current = 0;

    // Images elements
    let images: HTMLImageElement[] = [];

    // Called when an image is loaded
    let handler = function($pElement: HTMLImageElement) {
      // Add image element to list
      images.push($pElement[0] as HTMLImageElement);
      // Remove element to avoid memory leaks
      $pElement?.remove();
      // Count loaded image
      // If all are loaded, call handler
      if (++current == total) {
        pHandler(images);
      }
    };

    // Return list of created images
    let outputImages = [];

    // Browse URL's to load
    for (let i in pURLs) {
      // Create void image tag, attach loader THEN set src attribute to start loading
      let $img = document.createElement("img");
      // set src attribute to start loading
      $img.src = pURLs[i];
      // Add to return
      outputImages.push($img);

      // Append to body to keep in memory
      if (pAppendToBody) {
        // Hide image
        $img.style.position = "absolute";
        $img.style.left = "-100000";
        // append image in body
        document.body.appendChild($img);
      }

      // check
      if (!$img) {
        throw new Error(
          "LoadUtils.patchedOnLoad // $pElement need to target only one DOM element."
        );
      }
      // when image is loaded...
      $img.onload = () => handler($img);
    }

    return outputImages;
  }

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
  static preloadFont(fonts: string[], callback: () => void): void {
    let loadedFonts = 0;

    function fontLoaded() {
      if (++loadedFonts == fonts.length) {
        callback();
      }
    }

    for (let i = 0, l = fonts.length; i < l; ++i) {
      (function(font) {
        let node = document.createElement("span");
        // Characters that vary significantly among different fonts
        node.innerHTML = "giItT1WQy@!-/#";
        // Visible - so we can measure it - but not on the screen
        node.style.position = "absolute";
        node.style.left = "-10000px";
        node.style.top = "-10000px";
        // Large font size makes even subtle changes obvious
        node.style.fontSize = "300px";
        // Reset any font properties
        node.style.fontFamily = "sans-serif";
        node.style.fontVariant = "normal";
        node.style.fontStyle = "normal";
        node.style.fontWeight = "normal";
        node.style.letterSpacing = "0";
        document.body.appendChild(node);

        // Remember width with no applied web font
        let width = node.offsetWidth;

        node.style.fontFamily = font;

        let interval;
        let checked = 0;
        function checkFont() {
          //console.log("CHECK", node.offsetWidth, width);

          // Compare current width with original width
          if (node.offsetWidth != width || ++checked > 200 /* 10s */) {
            node.parentNode.removeChild(node);
            node = null;

            if (interval) {
              window.clearInterval(interval);
              fontLoaded();
            }
          }
        }

        interval = window.setInterval(checkFont, 100);
      })(fonts[i]);
    }
  }
}
