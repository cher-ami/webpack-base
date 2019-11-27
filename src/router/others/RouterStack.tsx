import React, { Component } from "react";
import { getRoute, IRoute } from "../RoutesList";
import { IPage } from "./IPage";
import RouterRegister from "../PageTransitionrRegister";

/**
 * Transition between pages.
 */
export enum ETransitionType {
  /**
   * [default]
   * New page will be added and played in after current page is played out.
   */
  SEQUENTIAL,

  /**
   * New page will be added on top of current page.
   * Current page will live until new page is played in and current page is played out.
   */
  CROSSED,

  /**
   * Transition control is delegated to props.transitionController handler.
   */
  CONTROLLED
}
/**
 * Transition control delegate API.
 * @param $oldPage Old page DOM element
 * @param $newPage New page DOM element
 * @param pOldPage Old page instance
 * @param pNewPage New page instance
 */
interface ITransitionControl {
  (
    $oldPage: HTMLElement,
    $newPage: HTMLElement,
    pOldPage: IPage,
    pNewPage: IPage
  ): Promise<any>;
}

interface IProps {
  // current location
  location: string;
  // about dynamic route, we need to get params
  params: { [x: string]: string };
  // transition type
  transitionType?: ETransitionType;
  // manage playIn and playOut and return a promise
  transitionControl?: ITransitionControl;
}

interface IStates {
  // counter
  count?: number;
  // oldRoute component
  oldRoute?: IRoute | null;
  // currentRoute component
  currentRoute?: IRoute | null;
}

// component name
const component: string = "RouterStack";

/**
 * @name Stack
 * @description
 */
export default class RouterStack extends Component<IProps, IStates> {
  /**
   * Check if we are in transition
   */
  protected _isPlayingIn = false;
  protected _isPlayingOut = false;
  get isInTransition(): boolean {
    return !this._isPlayingIn || !this._isPlayingOut;
  }

  /**
   * Default props
   */
  static defaultProps = {
    transitionType: ETransitionType.SEQUENTIAL
  } as IProps;

  /**
   * Init
   */
  constructor(props: IProps) {
    super(props);

    // init state
    this.state = {
      count: 0,
      oldRoute: null,
      currentRoute: getRoute({
        pLocation: this.props.location,
        pParams: this.props.params
      })
    };
  }

  componentDidMount(): void {}

  componentDidUpdate(
    prevProps: Readonly<IProps>,
    prevState: Readonly<IStates>,
    snapshot?: any
  ): void {
    // if location change
    if (prevProps.location !== this.props.location) {
      // increment page counter
      this.setState({
        count: this.state.count + 1
      });

      // get current route from routes array, depend of current location
      const currentRoute = getRoute({
        pLocation: this.props.location,
        pParams: this.props.params
      });

      // change transition boolean
      this._isPlayingIn = true;
      this._isPlayingOut = true;

      /**
       * SEQUENTIAL
       */
      if (this.props.transitionType === ETransitionType.SEQUENTIAL) {
        this.sequential(currentRoute);
      }
      /**
       * CROSSED
       */
      if (this.props.transitionType === ETransitionType.CROSSED) {
        this.crossed(currentRoute);
      }
      /**
       * CONTROLLED
       */
      if (this.props.transitionType === ETransitionType.CONTROLLED) {
        this.controlled(currentRoute);
      }
    }
  }

  /**
   * @name sequential
   * @param pCurrentRoute
   */
  protected async sequential(pCurrentRoute: IRoute) {
    // change pages state
    await this.setState({
      // pass current route as old route
      oldRoute: this.state.currentRoute,
      // empty current route
      currentRoute: pCurrentRoute
    });

    // // toggle playing state
    this._isPlayingOut = false;
    //
    // // change pages state
    // await this.setState({
    //   // empty old route
    //   oldRoute: null,
    //   // get new current route
    //   currentRoute: pCurrentRoute
    // });

    // toggle playing state
    this._isPlayingIn = false;
  }

  /**
   * @name crossed
   * @param pCurrentRoute
   */
  protected async crossed(pCurrentRoute: IRoute) {}

  /**
   * @name controlled
   * @param pCurrentRoute
   */
  protected async controlled(pCurrentRoute: IRoute) {}

  /**
   * Final render
   */
  render() {
    // get instance from state
    let OldRouteDom: any = this.state?.oldRoute?.component;
    // get instance from state
    let CurrentRouteDom: any = this.state?.currentRoute?.component;

    console.log({ OldRouteDom, CurrentRouteDom });

    return (
      <div className={component}>
        {OldRouteDom && <OldRouteDom key={this.state.count - 1} />}
        {CurrentRouteDom && <CurrentRouteDom key={this.state.count} />}
      </div>
    );
  }
}
