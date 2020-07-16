/**
 * @copyright Original work by Alexis Bouhet - https://zouloux.com
 */
// ----------------------------------------------------------------------------- GEOMETRY

/**
 * Get the angle between 3 points in radians
 * @param pPoints An array container 3 points, each point object need to have 'x' and 'y' properties.
 * @return Angle in radians
 */
export function angle3(pPoints: { x: number; y: number }[]): number {
  // Get 3 absolute angles
  let AB = Math.sqrt(
    Math.pow(pPoints[1].x - pPoints[0].x, 2) +
      Math.pow(pPoints[1].y - pPoints[0].y, 2)
  );
  let BC = Math.sqrt(
    Math.pow(pPoints[1].x - pPoints[2].x, 2) +
      Math.pow(pPoints[1].y - pPoints[2].y, 2)
  );
  let AC = Math.sqrt(
    Math.pow(pPoints[2].x - pPoints[0].x, 2) +
      Math.pow(pPoints[2].y - pPoints[0].y, 2)
  );

  // Compute relative angle between the 3 points
  return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
}

/**
 * Convert radian angle to degrees
 */
export function radToDeg(pAngle: number): number {
  return (pAngle / Math.PI) * 180;
}

/**
 * Convert degree angle to radians
 */
export function degToRad(pAngle: number): number {
  return (pAngle / 180) * Math.PI;
}

/**
 * Normalize an angle to be between -Math.PI and +Math.PI
 */
export function normalizeAngle(pAngle: number): number {
  return positiveModulo(pAngle + Math.PI, Math.PI * 2) - Math.PI;
}

// ----------------------------------------------------------------------------- RANGE UTILS

/**
 * Return an offset value in a range from 0 to max.
 * For exemple :
 * 1. if currentValue is 8, max is 9 and you set an offset of 1, you'll get back to 0.
 *
 * It also works for negative offsets :
 * 2. If currentValue is 0, max is 9 and you set an offset of -1, you'll get to 8
 *
 * It works with all offsets as real numbers less than max :
 * 3. If currentValue is 3, max is 9 and you set an offset of 8, you'll get to 2
 *
 * @param pCurrentValue
 * @param pMax
 * @param pOffset
 * @returns {number}
 */
export function circularRange(
  pCurrentValue: number,
  pMax: number,
  pOffset: number
): number {
  return (((pCurrentValue + pOffset) % pMax) + pMax) % pMax;
}

/**
 * Limit a value between a min and a max
 * @param pMin Can't go bellow
 * @param pValue Our value to limit
 * @param pMax Can't go above
 * @returns {number} Limited value
 */
export function limitRange(pMin: number, pValue: number, pMax: number): number {
  return Math.max(pMin, Math.min(pValue, pMax));
}

// ----------------------------------------------------------------------------- ARITHMETIC

/**
 * Returns positive modulo, even when 'n' is negative.
 * From http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving
 */
export function positiveModulo(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// ----------------------------------------------------------------------------- RANDOM

/**
 * Return a random number between min and max.
 * @param pMin Can't go bellow
 * @param pMax Can't go above
 * @param pRound If true, will be rounded by Math.floor.
 * @returns {number}
 */
export function randomRange(pMin: number, pMax: number, pRound = false) {
  // Get random value between min and max
  let value = pMin + Math.random() * (pMax - pMin);

  // Round if needed and return
  return pRound ? Math.floor(value) : value;
}

/**
 * Return a random integer number between 0 and pTo, excluded.
 * Usefull to get a random element from an array.
 * @param pTo Maximum number, excluded.
 * @returns {number} int from 0 to pTo, excluded
 */
export function randomTo(pTo: number): number {
  return Math.floor(Math.random() * pTo);
}

/**
 * Return true or false, you don't know.
 * @returns {boolean}
 */
export function randomBool(): boolean {
  return Math.random() > 0.5;
}

/**
 * Pick a random item from an indexed array
 * @param Indexed array only.
 * @returns {P} Randomly selected value.
 */
export function randomPickFromArray<P>(pArray: P[]): P {
  // Return randomly selected object
  return pArray[randomRange(0, pArray.length, true)];
}

/**
 * Pick a random item from an object.
 * Will return value.
 * @param pObject String indexed object
 * @returns {P} Randomly selected value.
 */
export function randomPickFromObject<P>(pObject: { [index: string]: P }): P {
  // Get object keys
  const keys = Object.keys(pObject);

  // Return randomly selected object
  return pObject[
    // Not calling randomPickFromArray for performances
    keys[
      // Pick random key
      randomRange(0, keys.length, true)
    ]
  ];
}
