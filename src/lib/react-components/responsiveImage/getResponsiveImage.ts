import { EImageSize, IImage } from "./ResponsiveImage";

/**
 * Get responsive image depend of window Width / parent width
 * Depend of Witch pWidth is passed to the function
 *
 * @param pImagesList
 * @param pWidth
 */

export interface IGetResponsiveImage {
  // array of image objects
  pImages: IImage[];
  // container width
  pWidth: number | EImageSize;
}

export function getResponsiveImage({
  pImages,
  pWidth
}: IGetResponsiveImage): IImage {
  // si pas d'image, ne pas continuer
  if (pImages == null) return;

  // retourner les largeurs d'image dispo en fonction de la taille du window
  const imagesWidth =
    // sortir la largeur de chaque image
    pImages
      .map(el => el.width)
      // les trier de la plus petite à la plus grande
      .sort((a, b) => a - b)
      // retourner uniquement les images qui ont une largeur plus grandre
      // que la largeur fr pWidth
      .filter(el => el > pWidth);

  // Stoquer la plus grande image du tableau qui servira de fallback
  const biggestImage = pImages.reduce(
    (a, b) => ((a.width || 0) > b.width ? a : b),
    pImages[0]
  );

  // retourner un objet image :
  const filtered = pImages
    .map(el => {
      // si la taille est egale à largeur d'image la plus petite du tableau,
      // retouner l'élément
      if (el.width === imagesWidth[0]) return el;
      // si la plus grande image est quand meme plus petite que
      // la taille du tableau, retourner cette plus grande image
      if (biggestImage.width <= pWidth) return biggestImage;
    })
    // filter le tableau et selectionner le premier objet du talbeau
    .filter(val => val);

  // retourner le résultat
  return filtered.length > 0 ? filtered[0] : null;
}
