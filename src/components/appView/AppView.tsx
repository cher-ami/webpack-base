import {hot} from 'react-hot-loader/root'
import React, {Component} from 'react'
import './AppView.less'

interface IProps {
  classNames?: string[]
}

interface IStates {}

const component: string = 'AppView'
class AppView extends Component<IProps, IStates> {

  // type local props and states
  public state: IStates
  public props: IProps

  // set default props if needed
  static defaultProps = {}

  // init component
  constructor(props: IProps) {
    // relay
    super(props)
    // init states
    this.state = {}
  }

  coucou () {
//    let aslzs:string = 2e0;
  }

  render() {
    return <div className={component}>
      <div className={`${component}_title`}>{component}</div>
    </div>
  }
}

// export by default with hot module reload enable
export default hot(AppView)
