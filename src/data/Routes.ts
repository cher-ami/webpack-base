import {ReactNode} from 'react'

export interface IRoute {
  // route name
  name: string
  // route component instance
  component: ReactNode
  // is default route application
  default: boolean
  // route path
  path: string
}

// utils format path
const formatPath = (pPath: string) =>
  [
    // base url
    process.env.BASE_URL,
    // param
    pPath
  ]
    .filter(v => v)
    .join('')

/**
 * @name Routes
 * @description Define Router routes of application
 */
export const Routes: IRoute[] = [

]
