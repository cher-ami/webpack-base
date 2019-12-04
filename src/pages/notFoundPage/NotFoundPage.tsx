import "./NotFoundPage.less";
import React, { PureComponent, RefObject } from "react";
import { prepare } from "../../helpers/prepare";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";

interface IProps {
  classNames?: string[];
}
interface IStates {}

// prepare
const { component, log } = prepare("NotFoundPage");

/**
 * @name NotFoundPage
 */
class NotFoundPage extends PureComponent<IProps, IStates> {
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

export default NotFoundPage;
