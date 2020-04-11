/**
 * @name merge
 * merge classes and return string
 * @param pClasses
 */
export const merge = (pClasses: any[]) => {
  // check
  if (pClasses.length > 0) {
    return (
      pClasses
        // concate sub array item if exist
        .reduce((a, b) => a.concat(b), [])
        // fitler empty values
        .filter((v) => v)
        // join array entries as string
        .join(" ")
    );
  }
};
