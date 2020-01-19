import { ICockpitPage } from "../lib/helpers/CockpitPages";
/**
 * Cockpit AppData Interface
 */
export interface ICockpitAppData {
  globals: {
    dictionary: {
      site: {
        [x: string]: any;
      };
      menus: {
        [x: string]: any;
      };
      languages: {
        [x: string]: any;
      };
      dictionary: {
        [key: string]: any;
      };
    };
  };
  pages: {
    [url: string]: ICockpitPage;
  };
}
