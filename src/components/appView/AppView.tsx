import css from "./AppView.module.less";
import React, { Component } from "react";
import {
  ReactViewStack,
  ETransitionType
} from "../../lib/solidify/react/ReactViewStack";
import { IRouteMatch, Router } from "../../lib/solidify/navigation/Router";
import { IPage } from "../../lib/solidify/navigation/IPage";
import MainMenu from "../mainMenu";
import { GridLayout } from "react-grid-layout-component/lib/GridLayout";
import { EEnv } from "../../types";
import { isEnv, showGridByDefault } from "../../helpers/nodeHelper";
import { prepareComponent } from "../../helpers/prepareComponent";
import { Atoms } from "../../atoms/Atoms";
import { merge } from "../../helpers/classNameHelper";

// ------------------------------------------------------------------------------- STRUCT

export interface IProps {
  currentPageName?: string;
}

export interface IStates {
  showGrid?: boolean;
}

// prepare
const { component, log } = prepareComponent("AppView");

/**
 * @name AppView
 * @description First App Component entry point
 * This component instanciate router stack
 */
class AppView extends Component<IProps, IStates> {
  // React view stack, showing pages when route changes
  protected _viewStack: ReactViewStack;

  // --------------------------------------------------------------------------- INIT

  constructor(props: IProps, context: any) {
    super(props, context);

    // initialize states
    this.state = {
      showGrid: showGridByDefault()
    } as IStates;
  }

  // --------------------------------------------------------------------------- LIFECYCLE

  componentDidMount() {
    // initialize router
    this.initRouter();
    // toggle grid layout visibility
    this.toggleGridVisibilityHandler();
  }

  componentWillUnmount() {
    Router.onNotFound.remove(this.routeNotFoundHandler);
    Router.onNotFound.remove(this.routeChangedHandler);
  }

  componentDidUpdate(pPrevProps: IProps, pPrevState: IStates) {}

  // --------------------------------------------------------------------------- ROUTER

  protected initRouter() {
    // Setup viewStack to show pages from Router automatically
    Router.registerStack("main", this._viewStack);

    // Listen to routes not found
    Router.onNotFound.add(this.routeNotFoundHandler, this);
    Router.onRouteChanged.add(this.routeChangedHandler, this);

    // Enable auto link listening
    Router.listenLinks();

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
    // log("Route changed", pRouteMatch);
  }

  /**
   * When a route is not found
   */
  protected routeNotFoundHandler(...rest) {
    console.error("ROUTE NOT FOUND", rest);
    // get not found page name
    const pageName = "NotFoundPage";
    // get not found page
    const notFoundPage = () => require("../../pages/notFoundPage");
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

  // --------------------------------------------------------------------------- KEY

  protected toggleGridVisibilityHandler() {
    // listen press onkey up
    document.body.onkeyup = (pEvent: KeyboardEvent) => {
      // if code key is G Key // toggle visibility state
      if (pEvent.code === "KeyG")
        this.setState({ showGrid: !this.state.showGrid });
    };
  }

  // --------------------------------------------------------------------------- RENDER

  render() {
    return (
      <div className={css.AppView}>
        {/* Grid */}
        {isEnv(EEnv.DEV) && this.state.showGrid && (
          <GridLayout
            columnsNumber={Atoms.grid["total-column-number"]}
            gutterSize={Atoms.grid["gutter-size"]}
            maxWidth={Atoms.grid["max-width-grid"]}
          />
        )}
        <div className={merge([css.wrapper, css.wrapper_green])}>
          {/* Redux example */}
          CurrentPageName from redux store >{" "}
          <span>{this.props.currentPageName}</span>
          {/* Main Menu */}
          <MainMenu classNames={[css.mainMenu, css.mainMenu_modifier]} />
          {/* View Stack */}
          <ReactViewStack
            ref={r => (this._viewStack = r)}
            transitionType={ETransitionType.PAGE_CROSSED}
            transitionControl={this.transitionControl.bind(this)}
            onNotFound={this.pageNotFoundHandler.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default AppView;
