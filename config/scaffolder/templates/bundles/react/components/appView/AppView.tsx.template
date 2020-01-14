import css from "./AppView.module.less";
import React, { Component } from "react";
import { IRouteMatch, Router } from "../../common/lib/router/Router";
import { EEnv } from "../../common/types";
import { isEnv, showGridByDefault } from "../../common/helpers/nodeHelper";
import { prepareComponent } from "../../common/helpers/prepareComponent";
import { merge } from "../../common/lib/helpers/classNameHelper";
import { atoms } from "../../common/atoms/atoms";
import Metas from "../../common/lib/react-components/metas";
import { GridLayout } from "@wbe/libraries";
import Main from "../../Main";
import { ETransitionType, ViewStack } from "../../common/lib/router/ViewStack";
import { TPageRegisterObject } from "../../common/lib/router/usePageRegister";

// ------------------------------------------------------------------------------- STRUCT

export interface IProps {}

export interface IStates {
  showGrid?: boolean;
}

// prepare
const { componentName, log } = prepareComponent("AppView");

/**
 * @name AppView
 * @description First App Component entry point
 * This component instanciate router stack
 */
class AppView extends Component<IProps, IStates> {
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
   * Transition manager between all React pages.
   * Useful if you want a custom transition behavior other than PAGE_SEQUENTIAL or PAGE_CROSSED.
   * You can setup a generic transition between all pages and do special cases here.
   * If you want to act on pages beyond just playIn and playOut methods, it's recommended to create an interface or an abstract.
   * To enable this feature, set prop transitionType to ETransitionType.CONTROLLED onto ReactViewStack component.
   * @return {Promise<any>}
   */
  protected transitionControl(
    pOldPage: TPageRegisterObject,
    pNewPage: TPageRegisterObject
  ): Promise<any> {
    return new Promise(async resolve => {
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
      <div className={merge([css.Root, componentName])}>
        {/* Grid */}
        {isEnv(EEnv.DEV) && this.state.showGrid && (
          <GridLayout
            columnsNumber={atoms.columnNumber}
            gutterSize={atoms.gutterSize}
            maxWidth={atoms.maxWidthGrid}
          />
        )}

        {/* Default Metas */}
        <Metas
          defaultMetas={true}
          title={""}
          description={""}
          pageURL={window.location.href}
          siteName={require("../../../package.json").name}
        />

        {/* AppView Wrapper */}
        <div className={css.wrapper}>
          {/* Menu example */}
          <ul className={css.items}>
            {/* Map availables routes */}
            {Main.routes.map((el, i) => {
              return (
                <li key={i} className={css.item}>
                  <a
                    className={css.link}
                    href={Router.generateURL({
                      page: el.page,
                      parameters: el.parameters
                        ? {
                            slug: el.parameters.slug
                          }
                        : null
                    })}
                    children={el.metas.name}
                    data-internal-link
                  />
                </li>
              );
            })}
          </ul>

          {/* View Stack */}
          <ViewStack
            ref={r => (this._viewStack = r)}
            allowSamePageTransition={["ArticlePage"]}
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
