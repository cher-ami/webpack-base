import LanguageService from "../services/LanguageService";
import { isEnv } from "./nodeHelper";
import { EEnv } from "../types";

const name = "DataFetcher";
const debug = require("debug")(`front:${name}`);

/**
 *
 */
class DataFetcher {
  /**
   * request
   * @param endpoint
   */
  public getApi({ endpoint }: { endpoint: string }): Promise<any> {
    // const build URL
    const url = this.prepareUrl({ endpoint });
    debug("url to request", url);
    // return promise
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to fetch "${url}", status: ${response.status}`);
      }
      return response.json();
    });
  }

  /**
   * Prepare URL
   * @desc prepare specific URL to get request API
   * @param appBase
   * @param locale
   * @param endpointName
   */
  private prepareUrl = ({
    endpoint,
    appBase = process.env.APP_BASE,
    locale = LanguageService.currentLanguageString,
  }: {
    endpoint: string;
    appUrl?: string;
    appBase?: string;
    locale?: string;
  }): string => {
    return [
      // ex: /this/branch
      isEnv(EEnv.DEV) ? "" : `${appBase}`,
      // ex: /fr
      locale ? `/${locale}` : "/",
      // ex: campain.json
      `/${endpoint}`,
    ]
      .filter((v) => v)
      .join("");
  };
}

export default new DataFetcher();
