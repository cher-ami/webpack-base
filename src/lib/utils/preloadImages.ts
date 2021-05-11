/**
 * @credits Original work by Alexis Bouhet - https://zouloux.com
 */

/**
 * Preload images from URL's. Will call handler when images are loaded.
 * @param pURLs URL's of images to load
 * @param pHandler Called when all images are loaded. First argument is list of loaded images elements.
 * @param pAppendToBody Will append image to body if true, false by default. Keep image in memory for ever.
 * @param pRemove Will remove image after pre-loaded. false by default. For legacy purpose.
 */
export const preloadImages = (
  pURLs: string[],
  pHandler: (pImages: HTMLElement[]) => void,
  pAppendToBody = false,
  pRemove = false
): HTMLImageElement[] => {
  // Count images
  let total = pURLs.length
  let current = 0

  // Images elements
  let images: HTMLImageElement[] = []

  // Called when an image is loaded
  let handler = function ($pElement: HTMLImageElement) {
    // Add image element to list
    images.push($pElement[0] as HTMLImageElement)
    // Remove element to avoid memory leaks
    $pElement?.remove()
    // Count loaded image
    // If all are loaded, call handler
    if (++current == total) {
      pHandler(images)
    }
  }

  // Return list of created images
  let outputImages = []

  // Browse URL's to load
  for (let i in pURLs) {
    // Create void image tag, attach loader THEN set src attribute to start loading
    let $img = document.createElement("img")
    // set src attribute to start loading
    $img.src = pURLs[i]
    // Add to return
    outputImages.push($img)

    // Append to body to keep in memory
    if (pAppendToBody) {
      // Hide image
      $img.style.position = "absolute"
      $img.style.left = "-100000"
      // append image in body
      document.body.appendChild($img)
    }

    // check
    if (!$img) {
      throw new Error(
        "LoadUtils.patchedOnLoad // $pElement need to target only one DOM element."
      )
    }
    // when image is loaded...
    $img.onload = () => handler($img)
  }

  return outputImages
}
