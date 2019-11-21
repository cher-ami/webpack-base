import "./ArticlePage.less";
import React, { RefObject, Component, forwardRef } from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { Helmet } from "react-helmet";

interface IProps {
  classNames?: string[];
}

interface IStates {}

// component name
const component: string = "ArticlePage";

function ArticlePage(props: IProps) {
  return <div className={component}>{component}</div>;
}

export default ArticlePage;

//
// /**
//  * @name ArticlePage
//  */
// export default class ArticlePage extends Component<IProps, IStates> {
//   protected rootRef: RefObject<HTMLDivElement>;
//
//   constructor(props) {
//     super(props);
//     this.rootRef = React.createRef();
//   }
//
//   /**
//    * PlayIn
//    */
//   public async playIn(): Promise<any> {
//     return new Promise(resolve => {
//       PageTransitionHelper.playIn(this.rootRef.current, resolve);
//     });
//   }
//
//   /**
//    * PlayOut
//    */
//   public async playOut(): Promise<any> {
//     return new Promise(resolve => {
//       PageTransitionHelper.playOut(this.rootRef.current, resolve);
//     });
//   }
//
//   render() {
//     return (
//       <div className={component} ref={this.rootRef}>
//         <Helmet>
//           <title>Article</title>
//         </Helmet>
//         {component}
//       </div>
//     );
//   }
// }
