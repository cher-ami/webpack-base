import { TweenLite } from "gsap/all";
import { MutableRefObject } from "react";

class PageTransitionHelper {
  protected _duration: number;

  constructor() {
    this._duration = 0.8;
  }

  public pagePlayIn(pRef: MutableRefObject<any>, pCallBack?: () => void) {
    TweenLite.fromTo(
      pRef.current,
      this._duration,
      {
        y: 100,
        autoAlpha: 0
      },
      {
        y: 0,
        autoAlpha: 1,
        onComplete: () => {
          pCallBack?.();
          console.log("PageTransitionHelper // play In Complete");
        }
      }
    );
  }

  public pagePlayOut(pRef: MutableRefObject<any>, pCallBack?: () => void) {
    TweenLite.to(pRef.current, 1, {
      y: 100,
      autoAlpha: 0,
      onComplete: () => {
        pCallBack?.();
        console.log("PageTransitionHelper // play In Complete");
      }
    });
  }

  public playIn(
    pRef,
    pCallBack?: () => void,
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
    pCallBack?: () => void,
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
