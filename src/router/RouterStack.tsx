import React, { Component } from "react";
import { EDependOf, getRoute, Routes } from "./Routes";
import { IPage } from "./IPage";
import { findDOMNode } from "react-dom";

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
  currentRouteIndex?: number;
  oldRoute?: any;
  currentRoute?: any;
}

// component name
const component: string = "RouterStack";

/**
 * @name Stack
 * @description
 */
export default class RouterStack extends Component<IProps, IStates> {
  /**
   * Get page instance
   */
  protected _oldRouteInstance: IPage = null;
  protected _currentRouteInstance: IPage = null;

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
      currentRouteIndex: 0,
      oldRoute: null,
      currentRoute: getRoute({
        pLocation: this.props.location
      })?.component
    };
  }

  componentDidMount(): void {
    this._currentRouteInstance?.playIn?.();
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
      const getCurrentRoute = getRoute({
        pLocation: this.props.location
      })?.component;

      // change transition boolean
      this._isPlayingIn = true;
      this._isPlayingOut = true;

      /**
       * SEQUENTIAL
       */
      if (this.props.transitionType === ETransitionType.SEQUENTIAL) {
        this.sequential(getCurrentRoute);
      }
      /**
       * CROSSED
       */
      if (this.props.transitionType === ETransitionType.CROSSED) {
        this.crossed(getCurrentRoute);
      }
      /**
       * CONTROLLED
       */
      if (this.props.transitionType === ETransitionType.CONTROLLED) {
        this.controlled(getCurrentRoute);
      }
    }
  }

  /**
   * @name sequential
   * @param pGetCurrentRoute
   */
  protected async sequential(pGetCurrentRoute) {
    // change pages state
    await this.setState({
      // pass current route as old route
      oldRoute: this.state.currentRoute,
      // empty current route
      currentRoute: null
    });

    // playOut old route
    await this._oldRouteInstance?.playOut?.();

    // toggle playing state
    this._isPlayingOut = false;

    // change pages state
    await this.setState({
      // empty old route
      oldRoute: null,
      // get new current route
      currentRoute: pGetCurrentRoute
    });

    // play In current route
    await this._currentRouteInstance?.playIn?.();

    // toggle playing state
    this._isPlayingIn = false;
  }

  /**
   * @name crossed
   * @param pGetCurrentRoute
   */
  protected async crossed(pGetCurrentRoute) {
    // change pages state
    await this.setState({
      // set current route as old route
      oldRoute: this.state.currentRoute,
      // get new current Route
      currentRoute: pGetCurrentRoute
    });

    // playOut old route
    this._oldRouteInstance?.playOut?.().then(() => {
      // change pages state
      this.setState({ oldRoute: null });
      // toggle playing state
      this._isPlayingOut = false;
    });

    // as the same time, playIn new current route
    await this._currentRouteInstance?.playIn?.();

    // toggle playing state
    this._isPlayingOut = false;
  }

  /**
   * @name controlled
   * @param pGetCurrentRoute
   */
  protected async controlled(pGetCurrentRoute) {
    // We need the control handler, check if.
    if (this.props.transitionControl == null) {
      throw new Error(
        "ReactViewStack.transitionControl // Please set transitionControl handler."
      );
    }

    // TODO ici ça ne fonctionne pas car on se un nouveau state à current route alors quon ne sais pas encore
    // si on veut le montrer ou non

    // change pages state
    await this.setState({
      // set current route as old route
      oldRoute: this.state.currentRoute,
      // get new current Route
      currentRoute: pGetCurrentRoute
    });

    // Call transition control handler with old and new pages instances
    // Listen when finished through promise
    await this.props.transitionControl(
      findDOMNode(this._oldRouteInstance as any) as HTMLElement,
      findDOMNode(this._currentRouteInstance as any) as HTMLElement,
      this._oldRouteInstance,
      this._currentRouteInstance
    );

    // toggle playing state
    this._isPlayingIn = false;
    this._isPlayingOut = false;

    // Remove old page from state
    this.setState({ oldRoute: null });
  }

  /**
   * Final render
   */
  render() {
    // get instance from state
    let OldRouteDom = this.state?.oldRoute;
    // get instance from state
    let CurrentRouteDom = this.state?.currentRoute;

    return (
      <div className={component}>
        {OldRouteDom && (
          <OldRouteDom
            key={this.state.currentRouteIndex - 1}
            ref={r => ((this._oldRouteInstance as any) = r)}
          />
        )}
        {CurrentRouteDom && (
          <CurrentRouteDom
            key={this.state.currentRouteIndex}
            ref={r => ((this._currentRouteInstance as any) = r)}
          />
        )}
      </div>
    );
  }
}
