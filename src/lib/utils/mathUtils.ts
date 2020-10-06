/**
 * @credits Original work by Alexis Bouhet - https://zouloux.com
 */
// ----------------------------------------------------------------------------- GEOMETRY

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
