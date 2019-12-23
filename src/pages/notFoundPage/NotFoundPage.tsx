import css from "./NotFoundPage.module.less";
import React, { RefObject } from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { ReactPage } from "../../lib/react/ReactPage";
import { prepareComponent } from "../../helpers/prepareComponent";

interface IProps {
  classNames?: string[];
}
interface IStates {}

// prepare
const { component, log } = prepareComponent("NotFoundPage");

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
      <div className={css.NotFoundPage} ref={this.rootRef}>
        {component}
      </div>
    );
  }
}

export default NotFoundPage;
