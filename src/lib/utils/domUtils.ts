/**
 * @copyright Original work by Alexis Bouhet - https://zouloux.com
 */

/**
 * The name of the silly greensock injected var
 */
const GS_TRANSFORM_KEY = "_gsTransform";

/**
 * Get a position value transformed by Greensock.
 * Ex X or Y while a transition on a any object.
 */
export function getGreensockValue(pTarget: any): number {
  // No target
  if (pTarget == null) {
    return null;
  }

  // Transform key available
  else if (GS_TRANSFORM_KEY in pTarget) {
    return pTarget[GS_TRANSFORM_KEY];
  }

  // Transform key available in first child
  else if (0 in pTarget && GS_TRANSFORM_KEY in pTarget[0]) {
    return pTarget[0][GS_TRANSFORM_KEY];
  } else return null;
}

/**
 * Get number value from a css property.
 * Will return an array with the number parsed value and the unit.
 * Can parse % and px values.
 * Will return [0, null] in case of error.
 * Exemple : cssToNumber("35px") -> [35, "px"]
 * @param pValue The returned value from css
 * @return First value is the number value, second index is the unit ("px" or "%")
 */
export function cssToNumber(pValue: string): any[] {
  // Chercher l'unité "px"
  let indexToCut = pValue.indexOf("px");

  // Chercher l'unité "%""
  if (indexToCut == -1) {
    indexToCut = pValue.indexOf("%");
  }

  // Résultat
  return (
    // Si on n'a pas trouvé l'unité
    indexToCut == -1
      ? // On ne peut pas retourner
        [parseFloat(pValue), null]
      : // Séparer la valeur de l'unité
        [
          parseFloat(pValue.substr(0, indexToCut)),
          pValue.substr(indexToCut, pValue.length).toLowerCase(),
        ]
  );
}

/**
 * Get scaled value of any DOM element even if scale is modified by a parent.
 * @param pElement The element to check
 * @returns {[number,number]} Will return an array with width and height values.
 */
export function getGlobalScale(pElement: HTMLElement): number[] {
  return [
    pElement.getBoundingClientRect().width / pElement["offsetWidth"],
    pElement.getBoundingClientRect().height / pElement["offsetHeight"],
  ];
}
