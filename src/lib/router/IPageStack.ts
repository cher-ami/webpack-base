/**
 * @credits Original work by Alexis Bouhet - https://zouloux.com
 */

export interface IPageStack {
  /**
   * Old loaded page name. Can be null.
   */
  readonly oldPageName: string;

  /**
   * Current loaded page name. Can be null.
   */
  readonly currentPageName: string;

  /**
   * If we are in transition state.
   */
  readonly isInTransition: boolean;

  /**
   * Show a page.
   * @param pPageName Name of the page to identify it and detect changes.
   * @param pPageImporter import returning a Promise. Like so : () => import('...')
   * @param pActionName Action to call
   * @param pParams Action parameters
   */
  showPage(
    pPageName: string,
    pPageImporter: () => Promise<any>,
    pActionName: string,
    pParams: { [index: string]: any }
  );
}
