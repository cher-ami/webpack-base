/**
 * merge strings with space
 * merge classes and return string
 * @param pClasses
 * @param pJoin
 */
export const merge = (pClasses: any[], pJoin: string = " "): string => {
  if (pClasses?.length > 0) {
    return pClasses
      .reduce((a, b) => a.concat(b), [])
      .filter((v) => v)
      .join(pJoin)
  }
}

/**
 * @credits Original work by Alexis Bouhet - https://zouloux.com
 * Check it an element is in an array.
 * Will only search at first level
 * @param pArray The array to search in
 * @param pElement The element to search for
 * @returns {boolean} True if pElement is in pArray
 */
export function inArray(pArray: any[], pElement: any): boolean {
  // Browse array
  for (let i in pArray) {
    // We got it
    if (pArray[i] == pElement) return true
  }
  // Not found
  return false
}

/**
 * @credits Original work by Alexis Bouhet - https://zouloux.com
 * Delete elements from an array following a condition.
 * Will return a new Array reference to re-affect.
 * @param pArray Array to remove from
 * @param pWhere Condition to satisfy to remove.
 * @returns {Array} New array reference to re-affect.
 */
export function deleteWhere(pArray: any[], pWhere: {}): any[] {
  // New array created
  let newArray = []

  // Browse array
  for (let i in pArray) {
    // Browse conditions
    for (let j in pWhere) {
      // Check if this object is ok with condition
      if (!(j in pArray[i]) || pWhere[j] != pArray[i][j]) {
        newArray.push(pArray[i])
        break
      }
    }
  }
  // Return filtered array
  return newArray
}

/**
 * @credits Original work by Alexis Bouhet - https://zouloux.com
 * Remove an element from an array.
 * Will return a new Array reference to re-affect.
 * @param pArray Array to search from
 * @param pElement Element to remove
 * @returns {Array} New array reference to re-affect.
 */
export function removeElement(pArray: any[], pElement: any) {
  // Browse array
  let newArray = []
  for (let i in pArray) {
    // If this is not not searched element
    if (pArray[i] != pElement) {
      // Add to new array
      newArray.push(pArray[i])
    }
  }
  // Return new array
  return newArray
}

/**
 * @credits Original work by Alexis Bouhet - https://zouloux.com
 * Shuffle an indexed array.
 * Source : https://bost.ocks.org/mike/shuffle/
 * @param pArray The indexed array to shuffle.
 * @returns {any} Original instance of array with same elements at other indexes
 */
export function shuffle(pArray: any[]): any[] {
  let currentIndex = pArray.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = pArray[currentIndex]
    pArray[currentIndex] = pArray[randomIndex]
    pArray[randomIndex] = temporaryValue
  }

  return pArray
}

/**
 * Split Array Of equal Chunks
 * ex:
 * arr = [1,2,3,4,5,6,7,8,9] can be split on 2 arrays
 * splitArrayToEqualChunks(arr, 2)
 * Will return [[1,2,3,4,5], [6,7,8,9]]
 * @param pArray
 * @param pNumber
 * @returns {Array}
 */
export const splitArrayToEqualChunks = (pArray: any[], pNumber: number) => {
  let rest = pArray.length % pNumber,
    restUsed = rest,
    partLength = Math.floor(pArray.length / pNumber),
    result = []

  for (let i = 0; i < pArray.length; i += partLength) {
    let end = partLength + i,
      add = false

    if (rest !== 0 && restUsed) {
      end++
      restUsed--
      add = true
    }

    result.push(pArray.slice(i, end))

    if (add) {
      i++
    }
  }
  return result
}
