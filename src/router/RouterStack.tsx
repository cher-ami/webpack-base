import React, { Component } from "react";
import { Routes } from "./Routes";
import { IPage } from "./IPage";

/**
 * Transition between pages.
 */
export enum ETransitionType {
  /**
   * [default]
   * New page will be added and played in after current page is played out.
   */
  PAGE_SEQUENTIAL,

  /**
   * New page will be added on top of current page.
   * Current page will live until new page is played in and current page is played out.
   */
  PAGE_CROSSED,

  /**
   * Transition control is delegated to props.transitionController handler.
   */
  CONTROLLED
}

interface IProps {
  transitionType: ETransitionType;
  classNames?: string[];
  location?: string;
}

interface IStates {
  currentRouteIndex?: number;
  oldRoute?: any;
  currentRoute?: any;
  currentRoutePlayin?: boolean;
}

// component name
const component: string = "RouterStack";

/**
 * @name Stack
 */
export default class RouterStack extends Component<IProps, IStates> {
  // get instance
  protected _oldRouteInstance: IPage = null;
  protected _currentRouteInstance: IPage = null;

  /**
   * If we are in transition
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
    transitionType: ETransitionType.PAGE_SEQUENTIAL
  };

  /**
   * Init
   */
  constructor(props: IProps) {
    super(props);

    // init state
    this.state = {
      currentRouteIndex: 0,
      oldRoute: null,
      currentRoute: Routes.find(el => el.path === this.props.location)
        .component,
      currentRoutePlayin: true
    };
  }

  componentDidMount(): void {
    if (this._currentRouteInstance !== null) {
      this._currentRouteInstance.playIn();
    }
  }

  componentDidUpdate(
    prevProps: Readonly<IProps>,
    prevState: Readonly<IStates>,
    snapshot?: any
  ): void {
    // if location change
    if (prevProps.location !== this.props.location) {
      // increment page counter
      this.setState({
        currentRouteIndex: this.state.currentRouteIndex + 1
      });

      // get current route from routes array, depend of current location
      const getCurrentRoute = Routes.find(el => el.path === this.props.location)
        .component;

      /**
       * Page sequential
       */
      if (this.props.transitionType === ETransitionType.PAGE_SEQUENTIAL) {
        this.pageSequential(getCurrentRoute);
      }

      /**
       * Page Cossed
       */
      if (this.props.transitionType === ETransitionType.PAGE_CROSSED) {
        this.pageCrossed(getCurrentRoute);
      }

      /**
       * Controlled
       */
      if (this.props.transitionType === ETransitionType.CONTROLLED) {
        this.pageControlled(getCurrentRoute);
      }
    }
  }

  /**
   * Page Sequential TimeLine
   * @param pGetCurrentRoute
   */
  protected async pageSequential(pGetCurrentRoute) {
    // change pages state
    await this.setState({
      // pass current route as old route
      oldRoute: this.state.currentRoute,
      // empty current route
      currentRoute: null
    });

    // playOut old route
    if (this._oldRouteInstance !== null && this._oldRouteInstance.playOut) {
      await this._oldRouteInstance.playOut();
    }

    // change pages state
    await this.setState({
      // empty old route
      oldRoute: null,
      // get new current route
      currentRoute: pGetCurrentRoute
    });

    // play In current route
    if (
      this._currentRouteInstance !== null &&
      this._currentRouteInstance.playIn
    ) {
      await this._currentRouteInstance.playIn();
    }
  }

  /**
   * Page Crossed TimeLine
   * @param pGetCurrentRoute
   */
  protected async pageCrossed(pGetCurrentRoute) {
    await this.setState({
      // set current route as old route
      oldRoute: this.state.currentRoute,
      // get new current Route
      currentRoute: pGetCurrentRoute
    });

    // playOut old route
    if (this._oldRouteInstance !== null && this._oldRouteInstance.playOut) {
      this._oldRouteInstance.playOut().then(() => {
        this.setState({ oldRoute: null });
      });
    }

    // as the same time, playIn new current route
    if (
      this._currentRouteInstance !== null &&
      this._currentRouteInstance.playIn
    ) {
      this._currentRouteInstance.playIn().then(() => {
        /// playOut ended
      });
    }
  }

  /**
   * TODO
   * Page Controlled TimeLine
   * @param pGetCurrentRoute
   */
  protected async pageControlled(pGetCurrentRoute) {}

  /**
   * Final render
   */
  render() {
    // get instance from state
    let OldRouteDom = this.state.oldRoute === null ? null : this.state.oldRoute;
    // get instance from state
    let CurrentRouteDom =
      this.state.currentRoute === null ? null : this.state.currentRoute;

    return (
      <div className={component}>
        {OldRouteDom !== null && (
          <OldRouteDom
            key={this.state.currentRouteIndex - 1}
            ref={r => ((this._oldRouteInstance as any) = r)}
          />
        )}
        {CurrentRouteDom !== null && (
          <CurrentRouteDom
            key={this.state.currentRouteIndex}
            ref={r => ((this._currentRouteInstance as any) = r)}
          />
        )}
      </div>
    );
  }
}
