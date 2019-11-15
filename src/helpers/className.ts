/**
 * @name className
 * @description Format BEM class with block, element, modifier
 * @param pBlock
 * @param pElement
 * @param pModifier
 */
export const className = (
  pBlock: string,
  pElement?: string,
  pModifier?: string
): string =>
  [
    // block name
    pBlock,

    // if element exist
    !!pElement ? `_${pElement}` : "",

    // if modifier exist
    !!pModifier ? `-${pModifier}` : ""
  ]
    .filter(v => v)
    .join("");

/**
 * @name classBlock
 * @description Return an class string
 * @param pClasses array of clasess
 */
export const classBlock = (pClasses: any[]) => {
  return (
    pClasses
      // remove undefined value
      .filter(v => v)
      // return string with space between each class
      .join(" ")
  );
};
