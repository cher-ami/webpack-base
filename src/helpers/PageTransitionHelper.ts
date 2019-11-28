import { gsap } from "gsap";
import { MutableRefObject } from "react";
import { prepare } from "./prepare";

// prepare
const { component, log } = prepare("PageTransitionHelper");

/**
 * @name PageTransitionHelper
 */
class PageTransitionHelper {
  protected _duration: number;

  constructor() {
    this._duration = 0.8;
  }

  /**
   * @name promisePlayIn
   * @param pRef
   * @param pCallBack
   */
  // prettier-ignore
  public promisePlayIn(pRef: MutableRefObject<any>, pCallBack?: () => void): Promise<any> {
    // retrun promise
    return new Promise(resolve => {
      // si pas de ref, exit
      if (!pRef.current) return;

      // anim
      gsap.fromTo(pRef.current, {
          autoAlpha:0,
          y: 100
        },{
          duration: this._duration,
          autoAlpha:1,
          y: 0,
         clearProps:"all",
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
  // prettier-ignore
  public promisePlayOut(pRef: MutableRefObject<any>, pCallBack?: () => void): Promise<any> {
    // retrun promise
    return new Promise(resolve => {
      // si pas de ref, exit
      if (!pRef.current) return;

      // anim
      gsap.fromTo(pRef.current, {
          autoAlpha:1,
          y: 0
        },{
          duration: this._duration,
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
