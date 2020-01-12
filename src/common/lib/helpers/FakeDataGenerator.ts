import {
  EImageSize,
  IImage
} from "../react-components/responsiveImage/ResponsiveImage";

/**
 * @name FakeDataGenerator
 * @description Generate fake data to simulate content
 */
class FakeDataGenerator {
  // API image
  private imageAPI = "https://picsum.photos";

  /**
   * Get random value
   * @param min
   * @param max
   */
  static randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static get randomId() {
    return FakeDataGenerator.randomIntFromInterval(1, 200);
  }

  // --------------------------------------------------------------------------- PUBLIC API

  /**
   * @name getResponsiveImageData
   * @param pRatio
   * @param pImageAPI
   */
  public getResponsiveImageData(
    pRatio: number = 4 / 3,
    pImageAPI = this.imageAPI
  ): IImage[] {
    // get breakpoint sizes
    const imageBreakPoints = [
      EImageSize.SMALL,
      EImageSize.MEDIUM,
      EImageSize.LARGE,
      EImageSize.XLARGE
    ];

    // get randomId
    const randomId = FakeDataGenerator.randomId;

    //  build array
    const fakeImageArray: IImage[] = imageBreakPoints.map(el => {
      // get image size depend of el
      const imageSize = {
        width: el,
        height: el / pRatio
      };

      // build url
      const buildURL = [
        // API
        pImageAPI,
        "/id/",
        randomId,
        // size
        "/",
        imageSize.width,
        "/",
        imageSize.height
        // random id
        //`?random=${randomId}`
      ].join("");

      // return build URL
      return {
        url: buildURL,
        width: imageSize.width,
        height: imageSize.height
      };
    });

    return fakeImageArray;
  }
}

export default new FakeDataGenerator();
