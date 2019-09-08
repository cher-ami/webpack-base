import {hot} from 'react-hot-loader/root'
import * as React from 'react'
import './AppView.less'

interface IProps {
  classNames?: string[]
}
const component: string = 'AppView'
const AppView = (props: IProps) => {
  // render
  return <div className={component}>{component}</div>
}

// export by default with hot module reload enable
export default hot(AppView)
