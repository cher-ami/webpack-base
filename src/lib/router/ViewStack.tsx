import React, { Component } from "react";
import { IPageStack } from "./IPageStack";
import { IActionParameters, Router } from "./Router";
import { TPageRegisterObject, pagesRegister } from "./usePageRegister";
const debug = require("debug")("lib:ViewStack");

/**
 * @credits Original ViewStack by Alexis Bouhet - https://zouloux.com
 * @credits Adapted for functional views by Willy Brauner - https://willybrauner.com
 */

// ----------------------------------------------------------------------------- STRUCT

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
  CONTROLLED,
}

/**
 * A page state, to show a page from Class / action / parameters
 */
interface IPageState {
  // Page class to instanciate with react
  pageComponent?: any;
  // Associated action
  action?: string;
  // Associated parameters
  parameters?: IActionParameters;
}

/**
 * Transition control delegate API.
 */
interface ITransitionControl {
  /**
   * Custom transition delegate.
   * Set props.transitionType to ETransitionType.CONTROLLER to enable custom transition control.
   * Please return promise and resolve it when old page can be removed.
   */
  (pOldPage: TPageRegisterObject, pNewPage: TPageRegisterObject): Promise<any>;
}

interface Props {
  /**
   * Type of transition between pages. @see ETransitionType
   * SEQUENTIAL by default
   */
  transitionType?: ETransitionType;

  /**
   * Custom transition delegate.
   * Set props.transitionType to ETransitionType.CONTROLLER to enable custom transition control.
   * Please return promise and resolve it when old page can be removed.
   */
  transitionControl?: ITransitionControl;

  /**
   * Called when page is not found.
   * Will not be called if showPage(null...) is called.
   * @param pPageName
   */
  onNotFound?: (pPageName: string) => void;

  /**
   * Called when loading state is changing.
   * Only useful when loading async import pages.
   */
  onLoadStateChanged?: (pLoading?: boolean) => void;

  /**
   * Allow some pages to have transition when the route changes but not the page.
   * Set an array of page names as strings.
   *
   * Alias of the class property, cannot be updated after mount.
   */
  allowSamePageTransition?: string[];

  /**
   * Called when a new page is mounted.
   * Usefull event after page is fully ready (styles / sizes / etc)
   * Which is not possible from AppView.
   */
  onPageMounted?: (pPage) => void;
}

interface States {
  // Current page index so react is not lost between old and new pages
  currentPageIndex?: number;
  // Old page state
  oldPage?: IPageState;
  // New page state
  currentPage?: IPageState;
}

/**
 * View Stack
 */
export class ViewStack extends Component<Props, States> implements IPageStack {
  //
  // --------------------------------------------------------------------------- LOCAL

  /**
   * Old page name
   */
  protected _oldPageName: string;
  get oldPageName(): string {
    return this._oldPageName;
  }

  /**
   * Current page name
   */
  protected _currentPageName: string;
  get currentPageName(): string {
    return this._currentPageName;
  }

  /**
   * If we are in transition
   */
  protected _playedIn = true;
  protected _playedOut = true;
  get isInTransition(): boolean {
    return !this._playedIn || !this._playedOut;
  }

  /**
   * Allow some pages to have transition when the route changes but not the page.
   * Set an array of page names as strings.
   */
  protected _allowSamePageTransition: string[];
  get allowSamePageTransition(): string[] {
    return this._allowSamePageTransition;
  }
  set allowSamePageTransition(value: string[]) {
    this._allowSamePageTransition = value;
  }

  // target old page register
  protected _oldPageRegister: TPageRegisterObject;

  // target current page register
  protected _currentPageRegister: TPageRegisterObject;

  // --------------------------------------------------------------------------- INIT

  /**
   * Default props
   */
  static defaultProps = {
    transitionType: ETransitionType.PAGE_SEQUENTIAL,
  };

  /**
   * Constructor
   * @param props
   * @param context
   */
  constructor(props: Props, context: any) {
    // Relay construction
    super(props, context);

    // Init state
    this.state = {
      currentPageIndex: 0,
      oldPage: null,
      currentPage: null,
    };

    // Set allowSamePageTransition from props if defined
    if ("allowSamePageTransition" in this.props) {
      this._allowSamePageTransition = this.props.allowSamePageTransition;
    }
  }

  // --------------------------------------------------------------------------- LIFE

  /**
   * Component is updated
   */
  componentDidUpdate(pOldProps: Props, pOldStates: States) {
    // If current page changed only, we need a playIn
    if (pOldStates.currentPage != this.state.currentPage) {
      // set old page register
      this._oldPageRegister = pagesRegister?.list?.[Router.previousPath];
      // set current page register
      this._currentPageRegister = pagesRegister?.list?.[Router.currentPath];

      const transitionType = this.props.transitionType;
      // execute transition depend of props.transitionType
      if (transitionType === ETransitionType.PAGE_SEQUENTIAL) this.sequential();
      if (transitionType === ETransitionType.PAGE_CROSSED) this.crossed();
      if (transitionType === ETransitionType.CONTROLLED) this.controlled();

      // Call page mounted event on props
      this.props?.onPageMounted?.(this.state.currentPage);
    }
  }

  /**
   * SEQUENTIAL
   * If transition type is sequential
   */
  protected async sequential() {
    // If we have an old page
    if (this.state.oldPage !== null) {
      // Play out transition
      await this._oldPageRegister?.playOut?.();
      // empty old page
      await this.setState({ oldPage: null });
      // transition is completed
      this._playedOut = true;
    }

    // If we have a new page
    if (this.state.currentPage !== null) {
      // Play in transition
      await this._currentPageRegister?.playIn?.();
      // transition is completed
      this._playedIn = true;
    }
  }

  /**
   * PAGE_CROSSED
   * If transition type is page crossed
   */
  protected crossed() {
    // If we have an old page
    if (this.state.oldPage !== null) {
      // Play out transition
      this._oldPageRegister?.playOut?.().then(() => {
        // empty old page
        this.setState({ oldPage: null });
        // transition is completed
        this._playedOut = true;
      });
    }

    // If we have a new page
    if (this.state.currentPage !== null) {
      // Play in transition
      this._currentPageRegister?.playIn?.().then(() => {
        // transition is completed
        this._playedIn = true;
      });
    }
  }

  /**
   * CONTROLLED
   * If transition type is page controlled
   */
  protected async controlled() {
    // Set transition state as started
    this._playedIn = false;
    this._playedOut = false;

    // Call transition control handler with old and new pages register
    await this.props.transitionControl(
      this._oldPageRegister,
      this._currentPageRegister
    );

    // Set transition state as ended
    this._playedIn = true;
    this._playedOut = true;

    // Remove old page from state
    this.setState({ oldPage: null });
  }

  // --------------------------------------------------------------------------- PAGES

  /**
   * Show a new page in this stack.
   *
   * Pass every parameter as null if you need to clear the stack.
   * Current page will be destroyed and no new page will be required.
   *
   * @param pPageName page name
   * @param pPageImporter import returning a Promise.
   * @param pActionName Action name to execute on page
   * @param pParameters Action parameters to pass
   * @returns false if page is not loaded
   */
  public showPage(
    pPageName: string,
    pPageImporter: () => Promise<any>,
    pActionName: string,
    pParameters: IActionParameters
  ): boolean {
    // If we do not allow transition for this page to itself
    if (
      this._allowSamePageTransition == null ||
      this._allowSamePageTransition.indexOf(pPageName) == -1
    ) {
      // And if this is the same page
      if (pPageName == this._currentPageName) {
        // Just change action and parameters, not page
        this.setState(
          {
            currentPage: {
              pageComponent: this.state?.currentPage?.pageComponent,
              action: pActionName,
              parameters: pParameters,
            },
          },
          this.updateActionOnCurrentPage.bind(this)
        );
        // Do not go further
        return true;
      }
    }

    // Bind play in method to the good scope and with new action parameters
    const boundAddNewPage = this.addNewPage.bind(
      this,
      pPageName,
      pPageImporter,
      pActionName,
      pParameters
    );

    // If we are in crossed transition mode or if this is the first page
    if (
      this.state.currentPage == null ||
      this.props.transitionType == ETransitionType.PAGE_CROSSED ||
      this.props.transitionType == ETransitionType.CONTROLLED
    ) {
      // Start new page directly
      boundAddNewPage();
    } else {
      // We haven't played out yet
      this._playedOut = false;

      // Else we have to play out the current page first
      this._currentPageRegister?.playOut?.().then(boundAddNewPage);
    }

    // Everything is ok
    return true;
  }

  /**
   * Add new page to state, by its name.
   * Will play in (through componentDidUpdate)
   * And also trigger action and parameters.
   * @param pPageName
   * @param pPageImporter
   * @param pActionName Action name to trigger
   * @param pParameters Associated parameters
   */
  protected addNewPage(
    pPageName: string,
    pPageImporter: () => Promise<any>,
    pActionName: string,
    pParameters: IActionParameters
  ): void {
    // If we are in sequential transition, we have played out here
    if (this.props.transitionType == ETransitionType.PAGE_SEQUENTIAL) {
      this._playedOut = true;
    }
    // We are playing in new page from here.
    this._playedIn = false;
    // Record old page name
    this._oldPageName = this._currentPageName;
    // Record new page name
    this._currentPageName = pPageName;

    // Only require new page if pageName is not null, else exit.
    if (pPageName === null) return;
    // Class of the new page, can be null if no new page is required
    let NewPageComponent: any;

    /**
     * When page is imported
     * @param moduleExports
     */
    const pageImortedHandler = (moduleExports) => {
      // Loading state changed, we are not loading anymore
      this.props?.onLoadStateChanged?.(false);
      // If this is a string, we certainly loaded a 404 ...
      if (typeof moduleExports === "string") {
        // Call not found handler
        this.props?.onNotFound?.(pPageName);
        return;
      }
      // Target export with default or page name
      NewPageComponent =
        // Target exports with page name or try default
        pPageName in moduleExports
          ? moduleExports[pPageName]
          : moduleExports["default"];

      // Set state with new page class, action and parameters
      // React will do its magic !
      this.setState(
        {
          // Incrément index for keys so react isn't lost between old and new pages
          currentPageIndex: this.state.currentPageIndex + 1,

          // Record current page as old page if we are in crossed or controlled transition type
          oldPage:
            this.props.transitionType == ETransitionType.PAGE_CROSSED ||
            this.props.transitionType == ETransitionType.CONTROLLED
              ? this.state.currentPage
              : null,

          // New page and associated action and parameters
          currentPage: {
            pageComponent: NewPageComponent,
            action: pActionName,
            parameters: pParameters,
          },
        },
        this.updateActionOnCurrentPage.bind(this)
      );
    };

    // Loading state changed, we are loading
    this.props?.onLoadStateChanged?.(true);
    // Remember window.onerror handler if already set
    const oldWindowOnError = window.onerror;

    /**
     * Reset global error handler and optionnaly throw a not page found
     * @param pThrow
     * @param pRestParameters
     */
    const resetError = (pThrow = false, pRestParameters: any = null) => {
      // If we have to throw a page not found error
      if (pThrow) {
        // Loading state changed, we are not loading anymore
        this.props?.onLoadStateChanged?.(false);
        // Delegate original global window onerror
        oldWindowOnError?.apply(window, pRestParameters);
        // Throw a not found page
        this.props?.onNotFound?.(pPageName);
      }
      // Reset global on error handler with remembered one
      window.onerror = oldWindowOnError;
    };

    // Set it to detect blocked promises due to XHR errors
    window.onerror = (...rest) => resetError(true, rest);

    // Execute importer
    const importResult = pPageImporter();

    // If this is a promise from an async import
    if (importResult instanceof Promise) {
      // Catch and throw errors
      importResult.catch(() => resetError(true));
      // Import succeed
      importResult.then((moduleExports) => {
        resetError();
        pageImortedHandler(moduleExports);
      });
    }
    // Else, this is a sync require call
    else {
      resetError();
      pageImortedHandler(importResult);
    }
  }

  /**
   * We call action on the new page once, and only when it's ready.
   */
  protected updateActionOnCurrentPage() {
    // TODO Still useFull ?
    if (this.state.currentPage === null) return;

    // this._currentPage.action(
    //   this.state.currentPage?.action,
    //   this.state.currentPage?.parameters
    // );
  }

  // ------------------------------------------------------------------------- RENDERING

  render() {
    // Page types from state
    // Use alias with CapitalCase so react detects it
    const OldPageType = this.state?.oldPage?.pageComponent;
    const CurrentPageType = this.state?.currentPage?.pageComponent;

    // Return DOM with current page
    return (
      <div className="ViewStack">
        {/* Show the old page */}
        {OldPageType && (
          <OldPageType
            key={this.state.currentPageIndex - 1}
            action={this.state.oldPage.action}
            parameters={this.state.oldPage.parameters}
          />
        )}

        {/* Show the new page */}
        {CurrentPageType && (
          <CurrentPageType
            key={this.state.currentPageIndex}
            action={this.state.currentPage.action}
            parameters={this.state.currentPage.parameters}
          />
        )}
      </div>
    );
  }
}
