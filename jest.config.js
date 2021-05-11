const { defaults } = require("jest-config")
module.exports = {
  // ...
  moduleFileExtensions: [...defaults.moduleFileExtensions, "js,", "jsx", "ts", "tsx"],
  // ...
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/config/jest/fileMock.js",
    "\\.(css|less)$": "<rootDir>/config/jest/styleMock.js",
  },
  moduleDirectories: ["node_modules", "src"],
}
