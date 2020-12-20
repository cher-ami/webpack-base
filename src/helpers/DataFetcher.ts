import LanguageService from "../lib/services/LanguageService";
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
    const url = this.prepareUrl({ endpoint });
    debug("url to request", url);
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
      // ex: /foo/bar
      process.env.NODE_ENV === "development" ? "" : `${appBase}`,
      // ex: /fr
      locale ? `/${locale}` : "/",
      // ex: home.json
      `/${endpoint}`,
    ]
      .filter((v) => v)
      .join("");
  };
}

export default new DataFetcher();
