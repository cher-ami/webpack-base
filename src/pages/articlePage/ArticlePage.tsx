import css from "./ArticlePage.module.less";
import React, { RefObject } from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { ReactPage } from "../../lib/core/ReactPage";
import { prepareComponent } from "../../helpers/prepareComponent";
import Metas from "../../lib/react-components/metas";
import { merge } from "../../lib/helpers/classNameHelper";

interface IProps {
  classNames?: string[];
  parameters?: any;

  // from store
  setcurrentPageName?: (pPageName: string) => void;
  currentPageName?: string;
}

interface IStates {}

// prepare
const { component, log } = prepareComponent("ArticlePage");

/**
 * @name ArticlePage
 */
class ArticlePage extends ReactPage<IProps, IStates> {
  // define ref
  protected rootRef: RefObject<HTMLDivElement>;

  constructor(pProps: IProps, pContext: any) {
    // relay
    super(pProps, pContext);
    // create ref
    this.rootRef = React.createRef();
  }

  // --------------------------------------------------------------------------- LIFE

  componentDidMount(): void {
    // set current page name in store
    this.props?.setcurrentPageName?.(component);
  }

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
      <div className={merge([css.Root, component])} ref={this.rootRef}>
        <Metas
          title={`${component} title`}
          description={`${component} description`}
        />
        {component}
        <h5>id {this.props.parameters.id}</h5>
        <h1>slug {this.props.parameters.slug}</h1>
      </div>
    );
  }
}

export default ArticlePage;
