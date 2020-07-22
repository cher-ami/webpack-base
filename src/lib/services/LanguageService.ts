import { EventEmitter } from "events";
import { Router } from "../router/Router";
import GlobalConfig from "../../data/GlobalConfig";
const debug = require("debug")("lib:LanguageService");

export enum ELanguage {
  FR,
  DE,
}

export const DEFAULT_LANGUAGE = ELanguage.FR;

export const languageToString = (language: ELanguage): string =>
  language === ELanguage.FR
    ? "fr"
    : language === ELanguage.DE
    ? "de"
    : undefined;

export const stringToLanguage = (string: string): ELanguage =>
  string === "fr" ? ELanguage.FR : string === "de" ? ELanguage.DE : undefined;

/**
 * Langage Service
 */
class LanguageService {
  public events: EventEmitter = new EventEmitter();

  /**
   * Get current Language
   */
  get currentLanguage() {
    if (Router.currentRouteMatch) {
      return stringToLanguage(
        Router.currentRouteMatch.parameters.lang as string
      );
    }

    // Router may not be init yet, try parsing url
    const route = window.location.pathname.startsWith(
      GlobalConfig.routerBaseUrl
    )
      ? window.location.pathname.replace(GlobalConfig.routerBaseUrl, "")
      : GlobalConfig.routerBaseUrl;
    const urlMatch = route.match(/^(de|fr)(\/|$)/i);
    const urlMatchLanguage = urlMatch && stringToLanguage(urlMatch[1]);

    if (urlMatchLanguage) {
      return urlMatchLanguage;
    }

    return DEFAULT_LANGUAGE;
  }

  /**
   * Get current Language as sting
   */
  get currentLanguageString() {
    return languageToString(this.currentLanguage);
  }

  /**
   * Set current Language
   */
  set currentLanguage(pCurrentLanguage: ELanguage) {
    if (this.currentLanguage === pCurrentLanguage) return;

    const newRouteMatch = Object.assign({}, Router.currentRouteMatch, {
      parameters: Object.assign({}, Router.currentRouteMatch.parameters, {
        lang: languageToString(pCurrentLanguage),
      }),
    });

    debug("Redirecting to", newRouteMatch);

    // Have to delay openPage call because it won't work if called synchronously
    setTimeout(() => Router.openPage(newRouteMatch, false), 10);
  }

  /**
   * Init language Service
   */
  init() {
    debug("Initializing router...");
    Router.onRouteChanged.add(this.routeChangedHandler, this);
  }

  /**
   * When route change
   */
  routeChangedHandler() {
    if (!Router.currentRouteMatch.parameters.lang) {
      throw new Error("No language parameter passed");
    }

    const language = stringToLanguage(
      Router.currentRouteMatch.parameters.lang as string
    );

    if (language === undefined) {
      debug("Incorrect language", Router.currentRouteMatch.parameters.lang);
      this.currentLanguage = DEFAULT_LANGUAGE;
    }
  }
}

export default new LanguageService();
