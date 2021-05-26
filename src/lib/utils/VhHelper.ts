/**
 * Set --vh variables on document, depending of clientHeight
 */
export default class VhHelper {
  constructor() {
    this.onResize()
    this.initEvents()
  }

  public initEvents() {
    window.addEventListener("resize", this.onResize)
  }

  public removeEvents() {
    window.removeEventListener("resize", this.onResize)
  }

  protected onResize = () => {
    const doc = document.documentElement
    const calc = (doc.clientHeight || window.innerHeight) * 0.1
    doc.style.setProperty("--vh", `${calc}`)
  }
}
