import css from "./App.module.less";
import React, { Component } from "react";
import { ETransitionType, ViewStack } from "../../lib/router/ViewStack";
import { IRouteMatch, Router } from "../../lib/router/Router";
import { TPageRegisterObject } from "../../lib/router/usePageRegister";
import {
  DEFAULT_LANGUAGE,
  languageToString,
  stringToLanguage,
} from "../../lib/services/LanguageService";
import { ERouterPage } from "../../routes";

const componentName = "App";
const debug = require("debug")(`front:${componentName}`);

export interface IProps {}

export interface IStates {}

/**
 * @name App
 * @description First App entry point
 */
class App extends Component<IProps, IStates> {
  protected _viewStack: ViewStack;

  /**
   * Constructor
   * @param props
   * @param context
   */
  constructor(props: IProps, context: any) {
    super(props, context);

    this.state = {
      // initialize states...
    } as IStates;
  }

  componentDidMount() {
    // initialize router
    this.initRouter();
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
    Router.registerStack("main", this._viewStack as any);
    Router.onNotFound.add(this.routeNotFoundHandler, this);
    Router.onRouteChanged.add(this.routeChangedHandler, this);
    Router.listenLinks();
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
  ): Promise<void> {
    return new Promise(async (resolve) => {
      debug({ pOldPage, pNewPage });
      const oldPageRef = pOldPage?.rootRef?.current;
      const newPageRef = pNewPage?.rootRef?.current;

      // hide new page fist
      if (newPageRef != null) newPageRef.style.visibility = "hidden";
      // playOut old page
      pOldPage && (await pOldPage?.playOut?.());

      // show new page
      if (newPageRef != null) newPageRef.style.visibility = "visible";
      // playIn new page
      pNewPage && (await pNewPage?.playIn?.());
      // All done
      resolve();
    });
  }

  /**
   * When route has changed
   */
  protected routeChangedHandler(pRouteMatch: IRouteMatch) {
    debug("pRouteMatch", pRouteMatch);

    if (!Router.currentRouteMatch.parameters.lang) {
      throw new Error("No language parameter passed");
    }

    const language = stringToLanguage(
      Router.currentRouteMatch.parameters.lang as string
    );

    if (language === undefined) {
      debug("Incorrect language", Router.currentRouteMatch.parameters.lang);

      // Show 404 page
      const notFoundPage = () =>
        require("../../pages/notFoundPage/NotFoundPage");

      setTimeout(
        () =>
          this._viewStack.showPage("NotFoundPage", notFoundPage, "index", {}),
        1
      );
    }
  }

  /**
   * When a route is not found
   */
  protected routeNotFoundHandler(...rest) {
    debug("Route not found", Router.currentPath);

    const cleanedPath = (Router.currentPath.endsWith("/")
      ? Router.currentPath.slice(0, -1)
      : Router.currentPath
    )
      // Remove multiple slashs
      .replace(/(https?:\/\/)|(\/)+/g, "$1$2");

    if (cleanedPath !== Router.currentPath) {
      debug("Trying path without ending slash", cleanedPath);

      const cleanedPathRoute = Router.URLToRoute(cleanedPath);

      if (cleanedPathRoute) {
        debug("Redirecting to", cleanedPathRoute);

        // Have to delay openPage call because it won't work if called synchronously
        setTimeout(() => Router.openPage(cleanedPathRoute, false), 10);
        return;
      }
    }

    const appBase = process.env.APP_BASE;

    let pathWithLanguage = `/${appBase}/${languageToString(
      DEFAULT_LANGUAGE
    )}${cleanedPath.replace(appBase, "")}`
      // Remove multiple slashs
      .replace(/(https?:\/\/)|(\/)+/g, "$1$2");

    debug("Trying with default language", pathWithLanguage);

    const pathWithLanguageRoute = Router.URLToRoute(pathWithLanguage);

    if (pathWithLanguageRoute) {
      debug("Redirecting to", pathWithLanguageRoute);

      // Have to delay openPage call because it won't work if called synchronously
      setTimeout(() => Router.openPage(pathWithLanguageRoute, false), 10);
      return;
    }

    // Show 404 page
    const notFoundPage = () => require("../../pages/notFoundPage/NotFoundPage");
    this._viewStack.showPage("NotFoundPage", notFoundPage, "index", {});
  }

  /**
   * When a page is not found
   * @param {string} pPageName
   */
  protected pageNotFoundHandler(pPageName: string) {
    console.error("PAGE NOT FOUND", pPageName);
  }

  // --------------------------------------------------------------------------- RENDER

  render() {
    return (
      <div className={css.root}>
        <div className={css.wrapper}>
          <nav className={css.nav}>
            <a
              className={css.link}
              href={Router.generateURL({ page: ERouterPage.HOME_PAGE })}
              children={"Home"}
              data-internal-link={true}
            />
            <a
              className={css.link}
              href={Router.generateURL({
                page: ERouterPage.WORK_PAGE,
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
            transitionType={ETransitionType.CONTROLLED}
            transitionControl={this.transitionControl.bind(this)}
            onNotFound={this.pageNotFoundHandler.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default App;
