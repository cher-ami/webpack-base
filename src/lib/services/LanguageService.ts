import { EventEmitter } from "events";
import GlobalConfig from "../../data/GlobalConfig";
import { Router } from "../router/Router";
const debug = require("debug")(`front:LanguageService`);

export enum ELanguage {
  FR = "fr",
  EN = "en",
}

export const DEFAULT_LANGUAGE = ELanguage.FR;

export const languageToString = (language: ELanguage): string =>
  language === ELanguage.FR
    ? "fr"
    : language === ELanguage.EN
    ? "en"
    : undefined;

export const stringToLanguage = (string: string): ELanguage =>
  string === "fr" ? ELanguage.FR : string === "en" ? ELanguage.EN : undefined;

class LanguageService {
  public events: EventEmitter = new EventEmitter();

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

    const urlMatch = route.match(/^\/?(de|fr)(\/|$)/i);
    const urlMatchLanguage = urlMatch && stringToLanguage(urlMatch[1]);

    if (urlMatchLanguage) {
      return urlMatchLanguage;
    }

    return DEFAULT_LANGUAGE;
  }

  get currentLanguageString() {
    return languageToString(this.currentLanguage);
  }

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
}

export default new LanguageService();
