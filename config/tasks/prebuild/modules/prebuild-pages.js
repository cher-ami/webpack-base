const { Files } = require("@zouloux/files");
const { logs } = require("../../../helpers/logs-helper");
const path = require("path");
const changeCase = require("change-case");
const debug = require("debug")("config:prebuild-pages");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// config
const config = require("../../../global.config");
// paths
const paths = require("../../../global.paths");

// ----------------------------------------------------------------------------- PRIVATE

/**
 * Page template
 */

const _pagesTemplate = ({ pages = [] }) => {
  return `/**
			 * WARNING
			 * Auto-generated file, do not edit!
			 *
			 * This file list all pages of this module.
			 * Forcing fuse to keep them and allowing dynamic import with quantum. 
			 */
			module.exports = [\n${pages.join("")}
			];`.replace(new RegExp(`(\n${"\t\t\t"})`, "gmi"), "\n");
};

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Prebuild .htaccess file
 * Usefull is this file
 */
const prebuildPages = (newFilePath = `${paths.src}/pages.ts`) => {
  return new Promise(resolve => {
    logs.start("Prebuild pages list...");

    // get all pages
    const pages = Files.getFolders(`${paths.src}/pages/*`).files;

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
      // importer is require page index in folder ex: require('./pages/homePage')
      const importer = `require("./pages/${path.basename(el)}")`;
      // template of one page importer array
      return [
        `${i === 0 ? "" : "\r"} {`,
        `\r    page: "${page}",`,
        `\r    importer: () => ${importer}`,
        `\r  },`
      ].join("");
    });

    debug("Create new src/pages.ts ");
    // create file
    Files.new(newFilePath).write(_pagesTemplate({ pages: formatedPagesArray }));
    // end
    logs.done();
    resolve();
  });
};

module.exports = { prebuildPages };
