import css from "./App.module.less";
import React, { Component } from "react";
import { EEnv } from "../../types";
import { GridLayout } from "@wbe/libraries";
import { ETransitionType, ViewStack } from "../../lib/router/ViewStack";
import { isEnv, showGridByDefault } from "../../helpers/nodeHelper";
import { IRouteMatch, Router } from "../../lib/router/Router";
import { TPageRegisterObject } from "../../lib/router/usePageRegister";
import { atoms } from "../../atoms/atoms";

const componentName = "App";
const debug = require("debug")(`front:${componentName}`);

// ----------------------------------------------------------------------------- STRUCT

export interface IProps {}

export interface IStates {
  showGrid?: boolean;
}

/**
 * @name App
 * @description First App entry point
 */
class App extends Component<IProps, IStates> {
  // React view stack, showing pages when route changes
  protected _viewStack: ViewStack;

  // --------------------------------------------------------------------------- INIT

  /**
   * Constructor
   * @param props
   * @param context
   */
  constructor(props: IProps, context: any) {
    super(props, context);

    // initialize states
    this.state = {
      showGrid: showGridByDefault,
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

  /**
   * Initialize Router
   */
  protected initRouter(): void {
    // Setup viewStack to show pages from Router automatically
    Router.registerStack("main", this._viewStack as any);
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
   * Transition manager between all pages.
   * Useful if you want a custom transition behavior other than PAGE_SEQUENTIAL or PAGE_CROSSED.
   * To enable this feature, set prop transitionType to ETransitionType.CONTROLLED onto ViewStack component.
   * @return {Promise<any>}
   */
  protected transitionControl(
    pOldPage: TPageRegisterObject,
    pNewPage: TPageRegisterObject
  ): Promise<any> {
    return new Promise(async (resolve) => {
      debug({ pOldPage, pNewPage });
      // target ref
      const oldPageRef = pOldPage?.rootRef?.current;
      const newPageRef = pNewPage?.rootRef?.current;

      // hide new page by default
      if (newPageRef !== null) newPageRef.style.visibility = "hidden";
      // playOut old page
      pOldPage && (await pOldPage?.playOut?.());
      // playIn old page
      pNewPage && (await pNewPage?.playIn?.());
      // All done
      resolve();
    });
  }

  /**
   * When route has changed
   */
  protected routeChangedHandler(pRouteMatch: IRouteMatch) {
    debug("Route changed", pRouteMatch);
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
      <div className={css.Root}>
        {isEnv(EEnv.DEV) && this.state.showGrid && (
          <GridLayout
            columnsNumber={atoms.gridColumnNumber}
            gutterSize={atoms.gridGutterSize}
            maxSize={atoms.gridMaxWidth}
          />
        )}
        <div className={css.wrapper}>
          <nav className={css.nav}>
            <a
              className={css.link}
              href={Router.generateURL({ page: "HomePage" })}
              children={"Home"}
              data-internal-link={true}
            />
            <a
              className={css.link}
              href={Router.generateURL({
                page: "WorkPage",
                parameters: {
                  slug: "custom-slug",
                },
              })}
              children={"Work"}
              data-internal-link={true}
            />
          </nav>
          <ViewStack
            ref={(r) => (this._viewStack = r)}
            transitionType={ETransitionType.PAGE_SEQUENTIAL}
            transitionControl={this.transitionControl.bind(this)}
            onNotFound={this.pageNotFoundHandler.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default App;
