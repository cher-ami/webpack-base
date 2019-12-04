import "./AppView.less";
import { hot } from "react-hot-loader/root";
import React, { Component } from "react";
import {
  ETransitionType,
  ReactViewStack
} from "../../lib/solidify-lib/react/ReactViewStack";
import { IRouteMatch, Router } from "../../lib/solidify-lib/navigation/Router";
import { IPage } from "../../lib/solidify-lib/navigation/IPage";
import MainMenu from "../mainMenu/MainMenu";
import { prepare } from "../../helpers/prepare";

// ------------------------------------------------------------------------------- STRUCT

export interface Props {}

export interface States {}

// prepare
const { component, log } = prepare("AppView");

class AppView extends Component<Props, States> {
  // React view stack, showing pages when route changes
  protected _viewStack: ReactViewStack;

  // --------------------------------------------------------------------------- INIT

  constructor(props: Props, context: any) {
    super(props, context);
  }

  // --------------------------------------------------------------------------- LIFECYCLE

  componentDidMount() {
    // initialize router
    this.initRouter();
  }

  componentWillUnmount() {
    Router.onNotFound.remove(this.routeNotFoundHandler);
    Router.onNotFound.remove(this.routeChangedHandler);
  }

  componentDidUpdate(pPrevProps: Props, pPrevState: States) {}

  // --------------------------------------------------------------------------- ROUTER

  protected initRouter() {
    // Setup viewStack to show pages from Router automatically
    Router.registerStack("main", this._viewStack);

    // Listen to routes not found
    Router.onNotFound.add(this.routeNotFoundHandler, this);
    Router.onRouteChanged.add(this.routeChangedHandler, this);

    // Start router
    Router.start();
  }

  // --------------------------------------------------------------------------- HANDLERS

  /**
   * Transition manager between all React pages.
   * Useful if you want a custom transition behavior other than PAGE_SEQUENTIAL or PAGE_CROSSED.
   * You can setup a generic transition between all pages and do special cases here.
   * If you want to act on pages beyond just playIn and playOut methods, it's recommended to create an interface or an abstract.
   * To enable this feature, set prop transitionType to ETransitionType.CONTROLLED onto ReactViewStack component.
   * @param {HTMLElement} $oldPage Old page HTMLElement. Can be null.
   * @param {HTMLElement} $newPage New page HTMLElement.
   * @param {IPage} pOldPage Old page component instance. Can be null.
   * @param {IPage} pNewPage New page component instance.
   * @return {Promise<any>}
   */
  protected transitionControl(
    $oldPage: HTMLElement,
    $newPage: HTMLElement,
    pOldPage: IPage,
    pNewPage: IPage
  ): Promise<any> {
    return new Promise(async resolve => {
      // You can implement your transition here

      // Do not forget to call playIn and playOut on pages.
      pOldPage != null && pOldPage.playOut();
      await pNewPage.playIn();

      // All done
      resolve();
    });
  }

  /**
   * When route has changed
   */
  protected routeChangedHandler(pRouteMatch: IRouteMatch) {
    log("Route changed", pRouteMatch);
  }

  /**
   * When a route is not found
   */
  protected routeNotFoundHandler(...rest) {
    console.error("ROUTE NOT FOUND", rest);
    // get not found page name
    const pageName = "NotFoundPage";
    // get not found page
    const notFoundPage = () => require("../../pages/notFoundPage/NotFoundPage");
    // show not found page
    this._viewStack.showPage(pageName, notFoundPage, "index", {});
  }

  /**
   * When a page is not found
   * @param {string} pPageName
   */
  protected pageNotFoundHandler(pPageName: string) {
    console.error("PAGE NOT FOUND", pPageName);
  }

  // --------------------------------------------------------------------------- PREPARE

  // --------------------------------------------------------------------------- RENDER

  render() {
    return (
      <div className={component}>
        <MainMenu />
        <ReactViewStack
          ref={r => (this._viewStack = r)}
          transitionType={ETransitionType.PAGE_CROSSED}
          transitionControl={this.transitionControl.bind(this)}
          onNotFound={this.pageNotFoundHandler.bind(this)}
        />
      </div>
    );
  }
}

export default hot(AppView);
