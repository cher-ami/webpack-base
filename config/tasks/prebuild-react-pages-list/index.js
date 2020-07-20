const { Files } = require("@zouloux/files");
const { logs } = require("../../helpers/logs-helper");
const path = require("path");
const changeCase = require("change-case");
const { getBundleListHelper } = require("../../helpers/get-bundle-list-helper");
const debug = require("debug")("config:prebuild-react-pages-list");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// config
const config = require("../../global.config");
// paths
const paths = require("../../global.paths");

// ----------------------------------------------------------------------------- PRIVATE

/**
 * Page template
 */

const _pagesTemplate = ({ pages = [] }) => {
  return `/**
			 * WARNING
			 * Auto-generated file, do not edit!
			 * This file list all pages of this module. 
			 */
			module.exports = [\n${pages.join("")}
			];`.replace(new RegExp(`(\n${"\t\t\t"})`, "gmi"), "\n");
};

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Prebuild .htaccess file
 * Usefull is this file
 */
const prebuildReactPagesList = () => {
  return new Promise(async (resolve) => {
    logs.start("Prebuild pages list");
    logs.note(`Required by JS router if addDynamicPageImporters is used.`);

    const bundleList = await getBundleListHelper(true);
    debug("bundleList", bundleList);

    if (bundleList.length === 0) resolve();

    bundleList.map((bundle) => {
      // get newFilePath
      const newFilePath = `${paths.src}/${bundle}/pages.ts`;
      logs.note(`pages.ts path: ${paths.src}/${bundle}/pages.ts`);
      // get all pages
      const pages = Files.getFolders(`${paths.src}/${bundle}/pages/*`).files;

      debug("Check if pages exist in page folder", pages);
      if (pages.length < 0) {
        log.error(`There is no page in ${paths.src}/pages folder. Aborting.`);
        resolve();
        return;
      }

      // get formated page array
      const formatedPagesArray = pages.map((el, i) => {
        // page name is PascalCase format
        const page = `${changeCase.pascalCase(path.basename(el))}`;
        // importer is require page index in folder ex: require('./pages/homePage/HomePage')
        const importer = `require("./pages/${path.basename(el)}/${page}")`;
        // template of one page importer array
        return [
          `${i === 0 ? "" : "\r"} {`,
          `\r    page: "${page}",`,
          `\r    importer: () => ${importer}`,
          `\r  },`,
        ].join("");
      });

      debug(`Create new src/${bundle}/pages.ts`);
      // create file
      Files.new(newFilePath).write(
        _pagesTemplate({ pages: formatedPagesArray })
      );
      // end
    });
    logs.done();
    resolve();
  });
};

module.exports = { prebuildReactPagesList };
