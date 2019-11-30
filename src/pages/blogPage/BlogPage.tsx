import "./BlogPage.less";
import React, { Component, RefObject, useRef } from "react";
import { prepare } from "../../helpers/prepare";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { usePageTransitionRegister } from "../../router/usePageTransitionRegister";

interface IProps {
  classNames?: string[];
}
interface IStates {}

const { component, log } = prepare("BlogPage");

/**
 * @name BlogPage
 */
// function BlogPage(props: IProps) {
//   // get current route
//   const rootRef = useRef<HTMLDivElement>(null);
//
//   // -------------------–-------------------–-------------------–--------------- PAGE TRANSITION
//
//   const playIn = (): Promise<any> =>
//     PageTransitionHelper.promisePlayIn(rootRef, () => log(`playIn complete`));
//
//   const playOut = (): Promise<any> =>
//     PageTransitionHelper.promisePlayOut(rootRef, () => log(`playOut complete`));
//
//   // register page transition
//   usePageTransitionRegister(component, playIn, playOut);
//
//   // -------------------–-------------------–-------------------–--------------- RENDER
//
//   return (
//     <div ref={rootRef} className={component}>
//       {component}
//     </div>
//   );
// }
//
// export default BlogPage;

/**
 * @name BlogPage
 */
export default class BlogPage extends Component<IProps, IStates> {
  protected rootRef: RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);
    this.rootRef = React.createRef();
  }

  /**
   * PlayIn
   */
  public async playIn(): Promise<any> {
    return new Promise(resolve => {
      PageTransitionHelper.promisePlayIn(this.rootRef, resolve);
    });
  }

  /**
   * PlayOut
   */
  public async playOut(): Promise<any> {
    return new Promise(resolve => {
      PageTransitionHelper.promisePlayOut(this.rootRef, resolve);
    });
  }

  render() {
    return (
      <div className={component} ref={this.rootRef}>
        {component}
      </div>
    );
  }
}
