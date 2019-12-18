import "./ArticlePage.less";
import React, { RefObject } from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { Helmet } from "react-helmet";
import { prepare } from "../../helpers/prepare";
import { ReactPage } from "../../lib/solidify/react/ReactPage";

interface IProps {
  classNames?: string[];
  parameters?: any;
}

interface IStates {}

// prepare
const { component, log } = prepare("ArticlePage");

/**
 * @name ArticlePage
 */
class ArticlePage extends ReactPage<IProps, IStates> {
  protected rootRef: RefObject<HTMLDivElement>;

  constructor(pProps: IProps, pContext: any) {
    super(pProps, pContext);
    this.rootRef = React.createRef();
  }

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
  protected playInPromiseHandler(pCompleteHandler: () => void) {
    return PageTransitionHelper.promisePlayIn(this.rootRef, pCompleteHandler);
  }

  /**
   * Play out animation.
   * Call complete handler when animation is done.
   */
  protected playOutPromiseHandler(pCompleteHandler: () => void) {
    return PageTransitionHelper.promisePlayOut(this.rootRef, pCompleteHandler);
  }

  render() {
    return (
      <div className={component} ref={this.rootRef}>
        <Helmet>
          <title>Article</title>
        </Helmet>
        {component}
        <h1>article "{this.props.parameters.slug}"</h1>
        <h5>article ID "{this.props.parameters.id}"</h5>
      </div>
    );
  }
}

export default ArticlePage;
