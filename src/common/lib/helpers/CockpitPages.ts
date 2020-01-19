import GlobalConfig from "../../data/GlobalConfig";
import { IRoute, Router } from "../router/Router";
import { extractPathFromBase, leadingSlash } from "../utils/stringUtils";
import { positiveModulo } from "../utils/mathUtils";
const debug = require("debug")("lib:cockpit-pages");

/**
 * @copyright Original files was write by @zouloux and was named "GravPages".
 */

/**
 * Default CockpitPage data types
 */
interface IDefaultCockpitPageData {
  // Allow every keys and values by default
  // so typescript does not throw errors when accessing via dot syntax
  [key: string]: any;
}

/**
 * Default CockpitPage dictionary types
 */
interface IDefaultCockpitPageDictionary {
  // Allow every keys and values by default
  // so typescript does not throw errors when accessing via dot syntax
  [key: string]: any;
}

/**
 * Object representing a Cockpit page from the CMS.
 * First generic is to strictly define page's data structure.
 * A default generic of IDefaultCockpitPageData is available for lazy devs.
 */
export interface ICockpitPage<GData = any, GDictionary = any> {
  // HTML output from Cockpit's content editor, can be null
  content?: string;
  // Generated data from the page's blueprint
  datas: GData;
  // Setup dictionary by default with all keys / value allowed by default
  dictionary: GDictionary;
  // Page name for solidify
  config: {
    componentName: string;
  };
  // Title of the page
  title: string;
  // Medias list
  media: {
    [name: string]: any;
  };
}

/**
 * Child Page object
 */
export interface ICockpitChildPage<GData = any> {
  path: string;
  data: ICockpitPage<GData>;
  media: any;
}

/**
 * Siblings children page possibiity
 */
export enum ESiblingPage {
  PREV,
  NEXT
}

export class CockpitPages {
  /**
   * Will add all Cockpit routes from GlobalConfig into the Router.
   */
  static addCockpitRoutesToRouter() {
    // Target pages
    const pagesData = GlobalConfig.appData.pages;
    // Browse routes to create a new array of routes
    let routes: IRoute[] = [];
    Object.keys(pagesData).map(pageHref => {
      // Target this page
      const page = pagesData[pageHref] as ICockpitPage;

      // Do not add page without pageName
      if (page.config.componentName == null) return;

      // Add this route
      routes.push({
        url: pageHref,
        page: page.config.componentName
      });
    });
    // Add them to the router
    Router.addRoutes(routes);
  }

  /**
   * Get current path and patch it by removing base from it for Cockpit.
   * Will return null if current route is not found by Router which can happen.
   * @param {boolean} pAddLeadingSlash Add a leading slash to the patched path, needed for Cockpit.
   * @return {string} Patched local path with or without leading slash.
   */
  static getCurrentLocalPath(pAddLeadingSlash = true): string {
    // If there is no route setup in Router yet
    if (Router.currentRouteMatch == null) return null;

    return leadingSlash(
      extractPathFromBase(Router.currentPath, GlobalConfig.baseURL),
      pAddLeadingSlash
    );
  }

  /**
   * Get current page from current href or from a specific URL as argument.
   *
   * First generic is to strictly define page's data structure.
   * A default generic of IDefaultCockpitPageData is available and set for lazy devs.
   *
   * @param {string} pURL Override this if you want to get page from another URL than the current one. Have
   *     to start without a slash and without including the base. @see StringUtils.extractPathFromBase if
   *     needed to format it.
   * @return {ICockpitPage<GData, GDictionary>}
   */
  static getCurrentPage<
    GData = IDefaultCockpitPageData,
    GDictionary = IDefaultCockpitPageDictionary
  >(pURL: string = null): ICockpitPage<GData, GDictionary> {
    // TODO : Trouver un moyen de ne pas passer par global config ici
    // TODO : Pour éviter le couplage entre cette classe qui va être dans le framework
    // TODO : Et GlobalData qui est dans le projet

    // Target app data and all pages data
    const appData = GlobalConfig.appData;
    const pagesData = appData.pages;

    // Get patched current path or asked URL from arguments
    // Prepend a slash so URL is matching Cockpit specifications
    const localPath =
      pURL == null ? this.getCurrentLocalPath() : leadingSlash(pURL);

    // If this page is not found or URL is not found, return null
    if (localPath == null || !(localPath in pagesData)) return null;

    // Return page object
    return pagesData[localPath];
  }

  /**
   * Get children pages datas from the current Parent page
   * @pParentPageName {string} Name of parent page
   * @return {ICockpitPage[]} Tableau contenant les pages enfants
   */
  static getChildrenPagesData(pParentPageName: string) {
    // Si le routeur n'a pas trouvé de page
    // if (Router.currentRouteMatch == null) return null;
    // Cibler les données de pages
    const pagesData = GlobalConfig.appData.pages;
    // Créer le tableau de donnnée des pages enfants
    let childrenPagesList = [];
    // Cibler les clefs des noms de pages
    Object.keys(pagesData)
      // filter ceux qui possède la clef
      .filter((page: string) => {
        // On retourne si
        return (
          // la page comprends le nom du parent
          page.includes(pParentPageName) &&
          // et si la page ne fini pas par le nom du parent
          !page.endsWith(pParentPageName)
        );
      })
      // On fait le tour de pages restantes
      .map(page => {
        // Pousser dans le tableau les infos des pages dont on a besoin
        childrenPagesList.push({
          path: page,
          data: pagesData[page],
          media: pagesData[page].media
        });
      });
    // retourner le tableau
    return childrenPagesList;
  }

  /**
   * Get Root Page data
   * Current Page data retourne la totalité des infos d'une pages,
   * Ici on a besoin d'avoir le meme formatage de sortie que getChildrenPageData
   * @pUrk {string} Name of page
   * @return {ICockpitPage[]} Tableau les datas
   */
  static getFormatedPagesData(pUrl: string): ICockpitChildPage {
    // Si le routeur n'a pas trouvé de page
    // if (Router.currentRouteMatch == null) return null;
    // Cibler les données de pages
    const pagesData = GlobalConfig.appData.pages;
    // Créer le tableau de donnnée des pages enfants
    let pageData;
    // Cibler les clefs des noms de pages
    Object.keys(pagesData)
      // filter ceux qui possède la clef
      .filter((page: string) => page.includes(pUrl))
      // On fait le tour de pages restantes
      .map(page => {
        // Pousser dans le tableau les infos des pages dont on a besoin
        pageData = {
          path: page,
          data: pagesData[page],
          media: pagesData[page].media
        };
      });
    // retourner le tableau
    return pageData;
  }

  /**
   * Get Prev or Next page data
   * At the same level of the current children Page
   *
   * @param {ESiblingPage} pSibling
   * @param {string} pParentPageName
   * @param {string} pCurrentChildrenPageName
   * @returns {ICockpitChildPage}
   */
  static getSiblingPage(
    pSibling: ESiblingPage = ESiblingPage.NEXT,
    pParentPageName: string,
    pCurrentChildrenPageName: string
  ): ICockpitChildPage {
    // grace à la page parent, on sait quels sont les pages enfants
    const childrenPagesList = CockpitPages.getChildrenPagesData(
      pParentPageName
    );
    // New variable with page position
    let pagePosition: number = 0;
    // For each pages in list
    childrenPagesList.forEach((el, i) => {
      // if path match
      if (el.path === `${pCurrentChildrenPageName}`)
        // return position in array
        pagePosition = i;
    });
    // Get next page number in array
    const nextPagePosition = positiveModulo(
      pSibling === ESiblingPage.NEXT ? pagePosition + 1 : pagePosition - 1,
      childrenPagesList.length
    );
    // return next page
    return childrenPagesList[nextPagePosition];
  }

  /**
   *
   * @param {string} name
   * @returns {IDefaultCockpitPageData[]}
   */
  static getPagesDataByName(name: string): IDefaultCockpitPageData[] {
    const pages = GlobalConfig.appData.pages;

    return Object.keys(pages)
      .filter(pagePath => pages[pagePath].config.componentName === name)
      .map(pagePath => {
        return {
          path: pagePath,
          data: pages[pagePath],
          media: pages[pagePath].media
        };
      });
  }

  /**
   *
   * @param {string} path
   * @returns {IDefaultCockpitPageData[]}
   */
  static getChildrenPagesDataByPath(path: string): IDefaultCockpitPageData[] {
    const pages = GlobalConfig.appData.pages;
    const childrenPagePathRegExp: RegExp = new RegExp(`^${path}\/`);

    return Object.keys(pages)
      .filter(pagePath => pagePath.match(childrenPagePathRegExp))
      .map(pagePath => {
        return {
          path: pagePath,
          data: pages[pagePath],
          media: pages[pagePath].media
        };
      });
  }
}
