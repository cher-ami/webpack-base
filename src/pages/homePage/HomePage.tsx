import "./HomePage.less";
import React, {
  RefObject,
  Component,
  forwardRef,
  useRef,
  useEffect,
  MutableRefObject
} from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import RouteTransition from "../../router/RouteTransition";
import { EPlayState } from "../../types";

interface IProps {
  classNames?: string[];
  playState: EPlayState;
  transitonComplete: (pPlay: EPlayState) => void;
}

interface IStates {}

// component name
const component: string = "HomePage";

function HomePage(props: IProps) {
  // const rootRef = useRef<HTMLDivElement>(null);

  function playInTransition(pRef) {
    return PageTransitionHelper.pagePlayIn(pRef, () =>
      props.transitonComplete(EPlayState.VISIBLE)
    );
  }

  function playOutTransition(pRef) {
    return PageTransitionHelper.pagePlayIn(pRef, () =>
      props.transitonComplete(EPlayState.HIDDEN)
    );
  }

  useEffect(() => console.log("props.playState", props.playState));

  return (
    <RouteTransition
      playIn={playInTransition}
      playOut={playOutTransition}
      playState={props.playState}
    >
      <div className={component}>{component}</div>
    </RouteTransition>
  );
}

// const HomePage = forwardRef((props:IProps, ref) => {
//   return <div {...ref} className={component}>{component}</div>;
// });

export default HomePage;

// /**
//  * @name HomePage
//  */
// export default class HomePage extends Component<IProps, IStates> {
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
//           <title>Home</title>
//         </Helmet>
//         {component}
//       </div>
//     );
//   }
// }
