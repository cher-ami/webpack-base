import React, { Component } from "react";
import { getRoute, IRoute } from "./Routes";
import { IPage } from "./IPage";
import { findDOMNode } from "react-dom";
import { Route } from "wouter";

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
      count: 0,
      oldRoute: null,
      currentRoute: getRoute({
        pLocation: this.props.location,
        pParams: this.props.params
      })
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
      currentRoute: pCurrentRoute
    });

    // play In current route
    await this._currentRouteInstance?.playIn?.();

    // toggle playing state
    this._isPlayingIn = false;
  }

  /**
   * @name crossed
   * @param pCurrentRoute
   */
  protected async crossed(pCurrentRoute: IRoute) {
    // change pages state
    await this.setState({
      // set current route as old route
      oldRoute: this.state.currentRoute,
      // get new current Route
      currentRoute: pCurrentRoute
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
   * @param pCurrentRoute
   */
  protected async controlled(pCurrentRoute: IRoute) {
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
      currentRoute: pCurrentRoute
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
    let OldRouteDom: any = this.state?.oldRoute?.component;
    // get instance from state
    let CurrentRouteDom: any = this.state?.currentRoute?.component;

    return (
      <div className={component}>
        {OldRouteDom && (
          <OldRouteDom
            key={this.state.count - 1}
            ref={r => ((this._oldRouteInstance as any) = r)}
          />
        )}
        {CurrentRouteDom && (
          <CurrentRouteDom
            key={this.state.count}
            ref={r => ((this._currentRouteInstance as any) = r)}
          />
        )}
      </div>
    );
  }
}
