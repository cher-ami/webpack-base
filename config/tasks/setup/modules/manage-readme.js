const { logs } = require("../../../helpers/logs-helper");
const { QuickTemplate } = require("../../../helpers/template-helper");
const { Files } = require("@zouloux/files");
const debug = require("debug")("config:manage-readme");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// target local path files
const paths = require("../paths");
// get local task config
const config = require("../config");

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Manage README file
 * @description allow to copy README as README-framework
 * and create new project README with setup information
 * @returns {Promise<unknown>}
 * @private
 */
const manageReadme = ({
  templatesPath = paths.templatesFolder,
  readmeFilePath = paths.readme,
  readmeFileName = "README.md",
  readmeFrameworkFileName = "README-framework.md",
  projectName = "[ PROJECT NAME ]",
  projectDescription = "[ PROJECT DESCRIPTION ]",
  projectAuthor = "[ PROJECT AUTHOR ]"
}) => {
  debug("params", {
    templatesPath,
    readmeFilePath,
    readmeFileName,
    readmeFrameworkFileName,
    projectName,
    projectDescription,
    projectAuthor
  });

  return new Promise(async resolve => {
    logs.start(
      `Change current ${readmeFileName} file as ${readmeFrameworkFileName}...`,
      true
    );

    // create new readme and add content on it
    if (!config.fakeMode) {
      debug("create new readme and add content on it");
      await Files.new(readmeFrameworkFileName).write(
        Files.getFiles(readmeFilePath).read()
      );
    } else {
      debug("FakeMode is activated, do nothing.".red);
    }
    // end
    logs.done(`${readmeFrameworkFileName} is created.`);

    // if file exist
    if (Files.getFiles(readmeFilePath).files.length > 0) {
      // remove it
      logs.start(`Remove ${readmeFilePath}...`);
      if (!config.fakeMode) {
        debug("file exist, remove it.");
        Files.getFiles(readmeFilePath).remove();
      } else {
        debug("FakeMode is activated, do nothing.".red);
      }
    } else {
      // else just log error
      logs.error(`${readmeFilePath} doesn't exist.`);
    }

    // create new template README.md from template
    if (!config.fakeMode) {
      debug("create new template README.md from template");
      await Files.new(readmeFileName).write(
        QuickTemplate(
          Files.getFiles(`${templatesPath}/README.md.template`).read(),
          // replace these variables
          {
            projectName,
            projectDescription,
            projectAuthor
          }
        )
      );
    } else {
      debug("FakeMode is activated, do nothing.".red);
    }
    // end
    logs.done(`${readmeFileName} is created.`);
    setTimeout(resolve, config.logDoneDelay);
  });
};

module.exports = { manageReadme };
