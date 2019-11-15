import "./BlogPage.less";
import React, { RefObject, Component } from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";

interface IProps {
  classNames?: string[];
}

interface IStates {}

// component name
const component: string = "BlogPage";

/**
 * @name BlogPage
 */
class BlogPage extends Component<IProps, IStates> {
  protected rootRef: RefObject<HTMLDivElement>;

  constructor(props?: IProps) {
    super(props);
    this.rootRef = React.createRef();
  }
  /**
   * PlayIn
   */
  public async playIn(): Promise<any> {
    return new Promise(resolve => {
      PageTransitionHelper.playIn(this.rootRef.current, resolve);
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

export default BlogPage;
