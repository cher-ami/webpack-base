import { useEffect, useState } from "react";
import { IPageData } from "../data/dataStruct";
import LanguageService, { ELanguage } from "common/services/LanguageService";
import { useAsyncEffect } from "@wbe/libraries";
import DataFetcher from "../helpers/DataFetcher";
import { metasOrderHelper } from "../helpers/metaOrderHelper";

const debug = require("debug")(`front:useGetApi`);

// TODO: add an example like in workpage ?
/**
 * use Fetch Api
 * Allow to request API
 */
export const useFetchApi = ({ endpoint }: { endpoint: string }) => {
  // data to request
  const [data, setData] = useState<IPageData>(null);
  // create page metas state
  const [metas, setMetas] = useState(null);
  // is loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // set fetch error state
  const [error, setError] = useState<boolean | undefined>();
  // get current language
  const [lang, setLang] = useState<ELanguage>(LanguageService.currentLanguage);

  // Check language every time so we relaunch a request
  // if language has changed since last time
  useEffect(() => {
    setLang(LanguageService.currentLanguage);
  });

  useAsyncEffect(async () => {
    try {
      const response = await DataFetcher.getApi({ endpoint: endpoint });
      // get response
      setData(response);

      debug("data from API", response);
      setMetas(metasOrderHelper({ pPageData: response }));

      // set is loading to false
      setIsLoading(false);
    } catch (e) {
      console.warn("FETCH DATA ERROR", e);
      setError(true);
    }
  }, [lang, endpoint]);

  useEffect(() => {
    debug("metas order", metas);
  }, [metas, endpoint]);

  return { data, metas, error, isLoading };
};
