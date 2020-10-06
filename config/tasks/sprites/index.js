/**
 * @credits Original by Alexis Bouhet - https://zouloux.com
 * @credits Adapted by Willy Brauner - https://willybrauner.com
 */

require("colors");
const { Files } = require("@zouloux/files");
const path = require("path");
const nsg = require("@zouloux/node-sprite-generator");
const Handlebars = require("handlebars");
const { optimizeFiles } = require("./imagemin");
const { logs } = require("../../helpers/logs-helper");
const debug = require("debug")("config:sprites");

// ----------------------------------------------------------------------------- PATH / CONFIG

// get paths
const globalPaths = require("../../global.paths");

// ----------------------------------------------------------------------------- CONFIG

// Sprite namming
const spritePrefix = "sprite";
const separator = "-";
const configExt = ".config.js";

// Default sprite config
const defaultSpriteConfig = {
  layout: "packed",
  pixelRatio: 1,
  layoutOptions: {
    padding: 2,
    scaling: 1,
  },
  compositorOptions: {
    compressionLevel: 6,
    filter: "none",
  },
};

// List of generated PNG files, before optimizing
const pngToOptimize = [];

/**
 * Optimize all generated png files with imagemin
 * @return {any[]}
 */
const optimizeImages = () => {
  // Return promises
  return pngToOptimize.map(
    // Optimize each generated png
    (png) =>
      optimizeFiles(
        // Target generated png file
        [`${png.outputPath}.png`],

        // Override the file
        png.bundleSpritePath,

        // Pass imagemin config
        png.spriteConfig.imagemin,

        // Do not add .min.png extension, we override
        false,

        // No console.log
        false
      )
  );
};

// ----------------------------------------------------------------------------- PUBLIC

/**
 * Sprites Task
 */
const sprites = (
  spritesTemplatesPath = globalPaths.spritesTemplatesPath,
  spritesOutputPath = globalPaths.spritesOutputPath
) =>
  new Promise((resolve) => {
    /**
     * Prepare
     */
    logs.start("Build sprites");

    // Get skeletons
    let skeletons = [
      // LESS Template
      {
        extension: "less",
        template: Handlebars.compile(
          Files.getFiles(`${spritesTemplatesPath}/sprite.less.template`).read()
        ),
      },
      // JSON Template
      {
        extension: "ts",
        template: Handlebars.compile(
          Files.getFiles(`${spritesTemplatesPath}/sprite.ts.template`).read()
        ),
      },
    ];

    // Generate sprite seed for cache busting
    const spriteSeed =
      (Math.random() * Math.pow(10, 16)).toString(16) +
      new Date().getTime().toString(16);

    /**
     *  Generate stylesheet
     */

    // Function called to generate a stylesheet
    const generateStylesheets = (
      pSpriteData,
      pSpriteBuffer,
      pSpriteName,
      pSpriteOutputPath,
      pStylesheetOptions,
      pStylesheetOutputPath
    ) => {
      // Create clean styleSheet data for handlebars skeletons
      const cleanStylesheetData = {
        spriteName: pSpriteName,
        spritePrefix: pStylesheetOptions.prefix,
        spriteSeed: spriteSeed,
        spriteWidth: pSpriteData.width,
        spriteHeight: pSpriteData.height,
        spritePath: pStylesheetOptions.spritePath,
        textures: [],
      };

      debug(cleanStylesheetData);

      // Browse images
      for (let i in pSpriteData.images) {
        // Target this image data
        let currentImage = pSpriteData.images[i];

        // Add clean data to clean styleSheet data
        cleanStylesheetData.textures.push({
          x: currentImage.x,
          y: currentImage.y,
          width: currentImage.width,
          height: currentImage.height,
          name: path.basename(
            currentImage.path,
            path.extname(currentImage.path)
          ),
        });
      }

      // Add lastOne flag for JSON files
      cleanStylesheetData.textures[
        cleanStylesheetData.textures.length - 1
      ].lastOne = true;

      // Browse already loaded skeletons
      for (let i in skeletons) {
        // Generate styleSheet from skeleton and write it to output file
        let currentSkeleton = skeletons[i];
        Files.new(
          `${pStylesheetOutputPath}.${currentSkeleton.extension}`
        ).write(currentSkeleton.template(cleanStylesheetData));
      }

      // Write sprite PNG file
      Files.new(`${pSpriteOutputPath}.png`).write(pSpriteBuffer);
    };

    /**
     * Generite sprite
     */

    let totalSprites = 0;

    // Browse bundles
    Files.getFolders(`${spritesOutputPath}/*/`).all((folder) => {
      // Browser sprites folders

      ++totalSprites;

      // Get sprite name from folder name
      const spriteName = path.basename(folder);

      // Read sprite config
      let spriteConfig;
      try {
        spriteConfig = require(`../${path.dirname(
          folder
        )}/${spritePrefix}${separator}${spriteName}${configExt}`);
      } catch (error) {
        // Default sprite config
        logs.note(
          `Config file not found for ${spriteName}. Using default config...`
        );
        spriteConfig = defaultSpriteConfig;
      }

      // Get images list
      const imageFiles = Files.getFiles(
        path.join(folder, "*.+(jpg|jpeg|png|gif)")
      );

      // Output path for styles / typescript and PNG file
      const outputPath = `${spritesOutputPath}/${spritePrefix}${separator}${spriteName}`;
      const PNGOutputPath = `${spritesOutputPath}/${spritePrefix}${separator}${spriteName}`;

      debug({ outputPath, PNGOutputPath });

      // Styles sheet path options
      const stylesheetOptions = {
        // Prefix for each image
        prefix: `${spritePrefix}${separator}${spriteName}`,

        // Relative path from web page to get PNG file
        spritePath: `${spritePrefix}${separator}${spriteName}.png`,

        // Pixel ratio from sprite config
        pixelRatio: spriteConfig.pixelRatio,
      };

      debug(stylesheetOptions);

      // Compute nsg options
      const nsgOptions = {
        // List of all images to include
        src: imageFiles.files,

        // Compiled PNG sprite file path
        spritePath: `${PNGOutputPath}.png`,

        // Layout config from config file
        layout: spriteConfig.layout,

        // Layout options from config file
        layoutOptions: spriteConfig.layoutOptions,

        // Compositor options from config file
        compositorOptions: spriteConfig.compositorOptions,

        // Method to render sprite sheet files
        render: (spriteData, pSpriteBuffer) => {
          generateStylesheets(
            spriteData,
            pSpriteBuffer,
            spriteName,
            PNGOutputPath,
            stylesheetOptions,
            outputPath
          );
        },
      };

      // When a sprite is generated
      const completeHandler = (error, cache) => {
        cache != null
          ? logs.note(`Sprite ${spriteName} already in cache.`)
          : logs.note(`Sprite ${spriteName} generated.`);

        // If there is an imagemin config
        if ("imagemin" in spriteConfig) {
          // Add this generated sprite to list of png to optimize
          pngToOptimize.push({
            spriteName,
            outputPath,
            bundleSpritePath: `${spritesOutputPath}/`,
            spriteConfig,
          });
        }

        // If we have an error
        if (error) {
          logs.error(`Error while creating sprite ${error}`);
          console.log("\007");
          process.exit(1);
        }

        // If every sprite has compiled
        else if (--totalSprites === 0) {
          logs.done();

          // Optimise images
          Promise.all(optimizeImages()).then(resolve);
        }
      };

      // Compute hash for images files
      const currentSpriteImagesHash = imageFiles.generateFileListHash(
        true,
        false
      );

      // Compute hash for config file
      const currentSpriteConfigHash = Files.getFiles(
        `${spritesOutputPath}/${spritePrefix}${separator}${spriteName}${configExt}`
      ).generateFileListHash(true, false);

      // Concat hashes
      const currentSpriteHash =
        currentSpriteImagesHash + currentSpriteConfigHash;

      // Target cache file which is storing current hashes
      const hashCacheFile = Files.getFiles(`${outputPath}.cache`);

      // Check if hashes changed
      if (
        hashCacheFile.exists() &&
        hashCacheFile.read() === currentSpriteHash
      ) {
        // If there is no changes, complete without recreating sprite
        setTimeout(() => completeHandler(false, true), 10);
        return;
      }

      // Write hash to cache
      hashCacheFile.write(currentSpriteHash);

      // Compile and check errors
      nsg(nsgOptions, completeHandler);
    });

    // If we do not have any sprites, we are done
    if (totalSprites === 0) {
      resolve();
      return;
    }

    logs.note(
      `Generating ${totalSprites} sprite${totalSprites > 1 ? "s" : ""}...`
    );
  });

module.exports = { sprites };
