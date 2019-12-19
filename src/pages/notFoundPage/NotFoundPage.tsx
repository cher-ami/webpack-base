import "./NotFoundPage.less";
import React, { RefObject } from "react";
import { prepare } from "../../helpers/prepare";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { ReactPage } from "../../lib/solidify/react/ReactPage";

interface IProps {
  classNames?: string[];
}
interface IStates {}

// prepare
const { component, log } = prepare("NotFoundPage");

/**
 * @name NotFoundPage
 */
class NotFoundPage extends ReactPage<IProps, IStates> {
  // local
  protected rootRef: RefObject<HTMLDivElement>;

  constructor(pProps: IProps, pContext: any) {
    // relay
    super(pProps, pContext);
    // create ref
    this.rootRef = React.createRef();
  }

  // --------------------------------------------------------------------------- LIFE

  componentDidMount(): void {}

  // --------------------------------------------------------------------------- TRANSITION

  /**
   * Action on this page.
   * Check props.action and props.parameters to show proper content.
   */
  action() {
    // Remove if not used
  }

  /**
   * Play in animation.
   * Call complete handler when animation is done.
   */
  protected playInHandler(pCompleteHandler: () => void) {
    return PageTransitionHelper.promisePlayIn(this.rootRef, pCompleteHandler);
  }

  /**
   * Play out animation.
   * Call complete handler when animation is done.
   */
  protected playOutHandler(pCompleteHandler: () => void) {
    return PageTransitionHelper.promisePlayOut(this.rootRef, pCompleteHandler);
  }

  // --------------------------------------------------------------------------- RENDER

  render() {
    return (
      <div className={component} ref={this.rootRef}>
        {component}
      </div>
    );
  }
}

export default NotFoundPage;
