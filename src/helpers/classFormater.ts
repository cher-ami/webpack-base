/**
 * Return an class string
 * @param pClasses array of clasess
 */
export const classFormater = (pClasses: any[]) => {
  return (
    pClasses
      // remove undefined value
      .filter(v => v)
      // return string with space between each class
      .join(' ')
  )
}
