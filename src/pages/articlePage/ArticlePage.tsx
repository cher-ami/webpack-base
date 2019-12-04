import "./ArticlePage.less";
import React, { RefObject, PureComponent } from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { Helmet } from "react-helmet";
import { prepare } from "../../helpers/prepare";

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
class ArticlePage extends PureComponent<IProps, IStates> {
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
