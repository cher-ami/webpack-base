/**
 * @credits Original by Alexis Bouhet - https://zouloux.com
 */
const imagemin = require("imagemin")
const imageminJpegtran = require("imagemin-jpegtran")
const imageminPngquant = require("imagemin-pngquant")
const { Files } = require("@zouloux/files")
const path = require("path")
const globalPaths = require("../../global.paths")

// Mini match targeting images inside a folder
const imagesMiniMatch = "*.{jpg,png}"

// Load config
const imageminConfig = require("./imagemin.config")

let tempUniqid = Date.now()
let counter = 0

/**
 * Public API
 */
module.exports = {
  /**
   * Optimize files with imagemin.
   * @param pInputFiles Array of minimatch files
   * @param pOutputFolder Output folder for every input files
   * @param pPngConfig Png config overriding default config
   * @param pAddDotMinAndDoNotOverride Do not override image and add .min extension before real file extension.
   * @param pVerbose Show console.log
   * @return {Promise<any>}
   */
  optimizeFiles: (
    pInputFiles,
    pOutputFolder,
    pPngConfig,
    pAddDotMinAndDoNotOverride,
    pVerbose = true
  ) =>
    new Promise((resolve) => {
      // Clone default config and override with custom config
      const pngConfig = { ...imageminConfig.defaultPNGSettings, ...pPngConfig }

      // If we need to add .min extension, output in a temp folder
      let tempOutput = pAddDotMinAndDoNotOverride
        ? `temp-${tempUniqid}-${++counter}/`
        : pOutputFolder

      // @see : https://github.com/imagemin/imagemin
      imagemin(
        // Input
        pInputFiles,

        // Output
        tempOutput,
        {
          plugins: [
            // @see : https://github.com/imagemin/imagemin-jpegtran
            imageminJpegtran(),

            // @see : https://github.com/imagemin/imagemin-pngquant
            imageminPngquant(pngConfig),
          ],
        }
      )
        // Finished
        .then((files) => {
          // If we need to add min extension
          if (pAddDotMinAndDoNotOverride) {
            // Browse images inside temp folder
            pInputFiles.map((file) => {
              // Read file extension
              const ext = path.extname(file)

              // New file name with .min extension before original file extension
              const newFileName = `${path.basename(file, ext)}.min${ext}`

              // Path of the minified image, in the same folder
              const minifiedDestinationPath = path.join(pOutputFolder, newFileName)

              // Delete previously minified image
              Files.getFiles(minifiedDestinationPath).delete()

              // Move file inside the same folder
              const minifiedTempPath = path.join(tempOutput, path.basename(file))
              Files.getFiles(minifiedTempPath).moveTo(minifiedDestinationPath)
            })
          }

          // Remove temp folder
          if (pAddDotMinAndDoNotOverride) {
            Files.getFolders(tempOutput).delete()
          }

          // Show files
          pVerbose &&
            files.map((file) => {
              const customConfigText =
                pPngConfig == null || Object.keys(pPngConfig).length === 0
                  ? "default config."
                  : JSON.stringify(pPngConfig)
              console.log(
                `	✓ Image ${path.basename(file.path)} optimized with ${customConfigText}.`
                  .grey
              )
            })

          // Done
          resolve()
        })
    }),

  /**
   * Optimize every images inside src folder and create .min versions with imagemin.
   * Sprites images will not be optimized because node fuse sprites handles it.
   * @return {Promise<any[]>}
   */
  run: () => {
    // Browse every images that are not inside a sprite folder
    const promises = Files.getFiles(
      `${globalPaths.src}*/!(${path.basename(
        globalPaths.spritesOutputPath
      )})/**/${imagesMiniMatch}`
    ).all((imageFile) => {
      // Skip already minified images
      const imageBaseName = path.basename(imageFile, path.extname(imageFile))
      if (imageBaseName.lastIndexOf(".min") === imageBaseName.length - 4) {
        // Delete this min file
        Files.getFiles(imageFile).delete()

        // Return no promise to skip
        return null
      }

      // Get override settings for this file
      let customConfig = {}
      Object.keys(imageminConfig.settingOverride).map((configPath) => {
        if (imageFile.indexOf(configPath) > 0) {
          customConfig = imageminConfig.settingOverride[configPath]
        }
      })

      // Optimize this file and get its promise
      return module.exports.optimizeFiles(
        [imageFile],
        path.dirname(imageFile),
        customConfig,
        // Add .min extension
        true
      )
    })

    // Start log
    const totalImages = promises.filter((p) => p != null).length
    console.log(
      `  → Optimizing ${totalImages} image${totalImages > 1 ? "s" : ""} ...`.cyan
    )

    // Done log
    Promise.all(promises).then(() => {
      console.log("  → Done !".green)
    })

    // Return all promises
    return Promise.all(promises)
  },
}
