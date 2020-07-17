import GlobalConfig, { IGlobalMetas } from "../data/GlobalConfig";
import { IPageData } from "../data/dataStruct";

const file = "metasOrderHelper";
const debug = require("debug")(`front:${file}`);

/**
 * Meta Order choice
 * @param pGlobalMeta
 * @param pPageData
 */

export const metasOrderHelper = ({
  pPageData,
  pGlobalSiteData = GlobalConfig?.globalData?.site,
}: {
  pPageData: IPageData;
  pGlobalSiteData?: any;
}): IGlobalMetas => {
  /**
   * Meta title
   * order:
   * - page meta title
   * - else, global meta title
   */
  let title: string | null = null;
  // meta specifique de la page
  if (pPageData?.metas?.title) {
    title = pPageData.metas.title;
    debug("pPageData.metas.title", pPageData.metas.title);
  }
  //  sinon, meta global
  else if (pGlobalSiteData?.metas?.title) {
    title = pGlobalSiteData.metas.title;
    debug("pGlobalSiteData.metas.title", pGlobalSiteData.metas.title);
  }

  /**
   *  Meta description
   * order:
   * - page meta description
   * - else, global meta description
   */

  let description: string | null = null;

  // meta specifique de la page
  if (pPageData?.metas?.description) {
    description = pPageData.metas.description;
    // si non global meta desc
  } else if (pGlobalSiteData?.metas?.description) {
    description = pGlobalSiteData.metas.description;
  }

  /**
   * Meta image
   * order:
   * - page meta image (thumb) URL
   * - else, global meta image (thumb) URL
   */

  let image: string | null = null;
  // meta specifique de la page
  if (pPageData?.metas?.image) {
    image = pPageData?.metas?.image;
  }
  //  sinon, image meta global
  else if (pGlobalSiteData?.metas?.image) {
    image = pGlobalSiteData?.metas?.image;
  }

  const finalDatas = {
    title,
    description,
    image,
  };

  debug("finalDatas", finalDatas);
  return finalDatas;
};
