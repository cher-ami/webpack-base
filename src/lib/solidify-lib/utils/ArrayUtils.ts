export class ArrayUtils {
  // TODO : Passer ses utils en generics pour garder le type
  // TODO : Virer var i in et passer en indexs

  /**
   * Check it an element is in an array.
   * Will only search at first level
   * @param pArray The array to search in
   * @param pElement The element to search for
   * @returns {boolean} True if pElement is in pArray
   */
  static inArray(pArray: any[], pElement: any): boolean {
    // Browse array
    for (let i in pArray) {
      // We got it
      if (pArray[i] == pElement) return true;
    }

    // Not found
    return false;
  }

  /**
   * Delete elements from an array following a condition.
   * Will return a new Array reference to re-affect.
   * @param pArray Array to remove from
   * @param pWhere Condition to satisfy to remove.
   * @returns {Array} New array reference to re-affect.
   */
  static deleteWhere(pArray: any[], pWhere: {}): any[] {
    // New array created
    let newArray = [];

    // Browse array
    for (let i in pArray) {
      // Browse conditions
      for (let j in pWhere) {
        // Check if this object is ok with condition
        if (!(j in pArray[i]) || pWhere[j] != pArray[i][j]) {
          newArray.push(pArray[i]);
          break;
        }
      }
    }

    // Return filtered array
    return newArray;
  }

  /**
   * Remove an element from an array.
   * Will return a new Array reference to re-affect.
   * @param pArray Array to search from
   * @param pElement Element to remove
   * @returns {Array} New array reference to re-affect.
   */
  static removeElement(pArray: any[], pElement: any) {
    // Browse array
    let newArray = [];
    for (let i in pArray) {
      // If this is not not searched element
      if (pArray[i] != pElement) {
        // Add to new array
        newArray.push(pArray[i]);
      }
    }

    // Return new array
    return newArray;
  }

  /**
   * Shuffle an indexed array.
   * Source : https://bost.ocks.org/mike/shuffle/
   * @param pArray The indexed array to shuffle.
   * @returns {any} Original instance of array with same elements at other indexes
   */
  static shuffle(pArray: any[]): any[] {
    let currentIndex = pArray.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = pArray[currentIndex];
      pArray[currentIndex] = pArray[randomIndex];
      pArray[randomIndex] = temporaryValue;
    }

    return pArray;
  }

  /**
   * Will count from a number to another by adding one at each loop.
   * Makes a 'for' loop with a function call.
   * Usefull with JSX
   * @see ArrayUtils.countWith
   * @param pFrom From which number to start counting
   * @param pTo To which number to end counting
   * @param pHandler Called at each iteration. Index is passed as first argument.
   * @returns {any[]}
   */
  static countFrom(
    pFrom: number = 0,
    pTo: number,
    pHandler: (pIndex: number) => any
  ): any[] {
    return this.countWith(pFrom, pTo, 1, pHandler);
  }

  /**
   * Will count from 0 to a number.
   * Makes a 'for' loop with a function call.
   * Usefull with JSX
   * @see ArrayUtils.countWith
   * @param pTo To which number to end counting
   * @param pHandler Called at each iteration. Index is passed as first argument.
   * @returns {any[]}
   */
  static countTo(pTo: number, pHandler: (pIndex: number) => any): any[] {
    return this.countWith(0, pTo, 1, pHandler);
  }

  /**
   * Makes a 'for' loop with a function call.
   * Usefull with JSX
   *
   * This is like doing :
   * for (let i = pFrom; i < pTo; i += pWith) pHandler( i );
   *
   * Will return an array with all executed handler results.
   *
   * @param pFrom From which number to start counting
   * @param pTo To which number to end counting
   * @param pWith With which number are we counting ? Increment
   * @param pHandler Called at each iteration. Index is passed as first argument.
   * @returns {any[]}
   */
  static countWith(
    pFrom: number,
    pTo: number,
    pWith: number,
    pHandler: (pIndex: number) => any
  ): any[] {
    // Make the loop
    let results: any[] = [];
    for (let i = pFrom; i < pTo; i += pWith) {
      // Call handler and store result
      results.push(pHandler(i));
    }

    // Return results
    return results;
  }
}
