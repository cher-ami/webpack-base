import { TweenLite } from "gsap/all";
import { MutableRefObject } from "react";
import { prepare } from "./prepare";
const { log } = prepare("PageTransitionHelper");

class PageTransitionHelper {
  protected _duration: number;

  constructor() {
    this._duration = 0.8;
  }

  public promisePlayIn(
    pRef: MutableRefObject<any>,
    pCallBack?: () => void
  ): Promise<any> {
    // retrun promise
    return new Promise(resolve => {
      // si pas de ref, exit
      if (!pRef.current) return;

      // anim
      // prettier-ignore
      TweenLite.fromTo(pRef.current, this._duration, {
          autoAlpha:0,
          y: 100
        },{
          autoAlpha:1,
          y: 0,
          onComplete: () => {
            pCallBack?.();
            resolve();
          }
        }
      );
    });
  }

  /**
   *
   * @param pRef
   * @param pCallBack
   */
  public promisePlayOut(
    pRef: MutableRefObject<any>,
    pCallBack?: () => void
  ): Promise<any> {
    // retrun promise
    return new Promise(resolve => {
      // si pas de ref, exit
      if (!pRef.current) return;

      // anim
      // prettier-ignore
      TweenLite.fromTo(pRef.current, this._duration, {
          autoAlpha:1,
          y: 0
        },{
          autoAlpha:0,
          y: 100,
          onComplete: () => {
            pCallBack?.();
            resolve();
          }
        }
      );
    });
  }
}

export default new PageTransitionHelper();
