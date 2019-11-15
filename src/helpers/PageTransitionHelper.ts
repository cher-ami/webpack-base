import { TweenLite } from "gsap/all";

class PageTransitionHelper {
  protected _duration: number;

  constructor() {
    this._duration = 0.8;
  }

  public playIn(
    pRef,
    pCallBack: () => void,
    pDuration: number = this._duration
  ): TweenLite {
    return TweenLite.from(pRef, pDuration, {
      y: 100,
      //color: "green",
      autoAlpha: 0,
      onComplete: () => {
        console.log("PageTransitionHelper // play In Complete");
        pCallBack && pCallBack();
      }
    });
  }

  public playOut(
    pRef,
    pCallBack: () => void,
    pCustomAnimation?: object,
    pDuration: number = this._duration
  ): TweenLite {
    return TweenLite.to(pRef, pDuration, {
      ...pCustomAnimation,
      autoAlpha: 0,
      onComplete: () => {
        console.log("PageTransitionHelper // play Out Complete");
        pCallBack && pCallBack();
      }
    });
  }
}

export default new PageTransitionHelper();
