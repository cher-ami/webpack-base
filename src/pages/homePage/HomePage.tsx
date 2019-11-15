import "./HomePage.less";
import React, { RefObject, Component } from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";

interface IProps {
  classNames?: string[];
}

interface IStates {}

// component name
const component: string = "HomePage";

/**
 * @name HomePage
 */
export default class HomePage extends Component<IProps, IStates> {
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
      PageTransitionHelper.playIn(this.rootRef.current, resolve);
      //resolve()
    });
  }

  /**
   * PlayOut
   */
  public async playOut(): Promise<any> {
    return new Promise(resolve => {
      PageTransitionHelper.playOut(this.rootRef.current, resolve);
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

// export default HomePage;
//
// import "./HomePage.less";
// import React, {useRef} from "react"
// import { classBlock } from "~helpers/className";
// import { TweenLite } from "gsap";
//
// interface IProps {
//   classNames?: string[];
// }
//
// // component name
// const component: string = "HomePage";
//
// /**
//  * playIn
//  */
// export const useHomePagePlayIn = async (pRef) => {
//   new Promise(resolve => {
//     TweenLite.from(pRef, 1, {
//       autoAlpha: 0,
//       onComplete: resolve
//     });
//   });
// };
//
// /**
//  * playOut
//  */
// HomePage.playOut = async (pRef) => {
//   new Promise(resolve => {
//     TweenLite.fromTo(
//       pRef,
//       1,
//       {
//         autoAlpha: 1
//       },
//       {
//         autoAlpha: 0,
//         onComplete: resolve
//       }
//     );
//   });
// };
//
// /**
//  * @name HomePage
//  */
// function HomePage(props: IProps) {
//
//   const rootRef = useRef(null);
//
//   const playIn = useHomePagePlayIn(rootRef.current);
//
//   // --------------------------------------------------------------------------- PREPARE
//
//   // prepare class block string
//   const block = classBlock([component, props.classNames]);
//
//   // --------------------------------------------------------------------------- RENDER
//
//   return <div className={block} ref={rootRef}>{component}</div>;
// }
//
// export default HomePage;
