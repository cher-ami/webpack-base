/**
 * @copyright Original work by Alexis Bouhet - https://zouloux.com
 */

/**
 * RGB Color object
 */
export class Color {
  // ------------------------------------------------------------------------- STATIC

  /**
   * Create color object from hexadecimal string
   * @param pHex Hexadecimal string as #FFFFFF or FFFFFF
   */
  static fromHexString(pHex: string): Color {
    let c = new Color();
    c.fromHexString(pHex);
    return c;
  }

  /**
   * Create color object from hexadecimal number
   * @param pHex Hexadecimal number as 0xFFFFFF
   */
  static fromHexNumber(pHex: number): Color {
    let c = new Color();
    c.fromHexNumber(pHex);
    return c;
  }

  // ------------------------------------------------------------------------- PROPERTIES

  /**
   * Red component from 0 to 1
   */
  r: number;

  /**
   * Green component from 0 to 1
   */
  g: number;

  /**
   * Blue component from 0 to 1
   */
  b: number;

  /**
   * Constructor of a color
   * @param pR Red component from 0 to 1
   * @param pG Green component from 0 to 1
   * @param pB Blue component from 0 to 1
   */
  constructor(pR: number = 0, pG: number = 0, pB: number = 0) {
    this.r = pR;
    this.g = pG;
    this.b = pB;
  }

  // ------------------------------------------------------------------------- FROM

  /**
   * Feed values from hexadecimal string
   * @param pHex Hexadecimal string as #FFFFFF or FFFFFF
   */
  fromHexString(pHex: string) {
    // Parse hexadecimal with or without hash
    let match = pHex.replace(/#/, "").match(/.{1,2}/g);

    // Extract values and feed color object
    this.r = parseInt(match[0], 16);
    this.g = parseInt(match[1], 16);
    this.b = parseInt(match[2], 16);
  }

  /**
   * Feed values from hexadecimal number
   * @param pHex Hexadecimal number as 0xFFFFFF
   */
  fromHexNumber(pHex: number) {
    this.fromHexString(pHex.toString(16));
  }

  // ------------------------------------------------------------------------- TO / AS

  /**
   * Convert as hexadecimal value, with or without hash :
   * #FFFFFF
   * @param pWithHash Prepend with # or not
   * @returns {string}
   */
  asHex(pWithHash = true): string {
    return pWithHash
      ? "#"
      : "" +
          ColorUtils.componentToHex(this.r) +
          ColorUtils.componentToHex(this.g) +
          ColorUtils.componentToHex(this.b);
  }

  /**
   * Convert as css color : rgb(255, 255, 255)
   * @returns {string}
   */
  asCss(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
}

/**
 * Color utils static class
 */
export class ColorUtils {
  /**
   * Convert component 0-1 to 00-FF hex
   * @param component Component from 0 to 1
   * @returns {string} Hex from 00 to FF
   */
  static componentToHex(component) {
    // Convert to hex
    let hex = component.toString(16);

    // Prepend with 0 to be always on two digits
    return hex.length == 1 ? "0" + hex : hex;
  }

  /**
   * Compute color between to colors
   * @param pA Color A
   * @param pB Color B
   * @param pRatio Ratio between color A and B, from 0 is A to 1 is B
   * @returns {Color} Color RGB Object
   */
  static colorBetween(pA: Color, pB: Color, pRatio) {
    // Create color
    let newColor = new Color();

    // Parse color components
    ["r", "g", "b"].map((component) => {
      // Compute ratio for each color component
      newColor[component] = Math.round(
        pA[component] + (pB[component] - pA[component]) * pRatio
      );
    });

    // Return new color
    return newColor;
  }
}
