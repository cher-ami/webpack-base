import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { getResponsiveImage } from "./getResponsiveImage";

import { transparentImageUrl } from "./transparentImageUrl";
import {
  EListener,
  useBoundingClientRect
} from "../../react-hooks/useBoundingClientRect";
import { useIsInViewport } from "../../react-hooks/useIsInViewport";

// ------------------------------------------------------------------------------- STRUCT

interface IProps {
  // element classes
  classNames?: string[];
  // type of image
  type: EImageType;
  // Array of image object [{}, {}, ...]
  data: IImage[];
  // alt text
  alt?: string;
  // children element in Background image
  children?: ReactNode;
  // lazyLoading
  lazy?: boolean;
  // load image at Xpx of top/bottom window
  // ex: -40 allow to preload image when it's top or bottom is to 40px before or after border window
  lazyOffset?: number;
  // fix no responsive image to specific image size
  fixImageSize?: EImageSize;
  // fix a custom vertical ratio : vertical ratio = height / width
  fixVerticalRatio?: number;
  // set specific background color
  backgroundColor?: string;
  // change css backgroundPosition
  backgroundPosition?: number[];
  // style child element
  childStyle?: CSSProperties;
}

/**
 * Default props
 */
ResponsiveImage.defaultProps = {
  lazy: false,
  lazyOffset: 0
};

/**
 * Image Type
 */
export enum EImageType {
  // <img> HTML tag
  IMAGE_TAG = "imageTag",
  // <div> background image
  BACKGROUND_IMAGE = "backgroundImage"
}

/**
 * Single Image Object properties
 */
export interface IImage {
  url: string;
  width?: number;
  height?: number;
  ratio?: number;
}

/**
 * Responsive break sizes
 */
export enum EImageSize {
  SMALL = 640,
  MEDIUM = 1024,
  LARGE = 1640,
  XLARGE = 1900,
  XXLARGE = 2560
}

// component name
const component: string = "ResponsiveImage";

/**
 *  @name: ResponsiveImage
 *  @description: Display simple Image Tag or div Background Image with options:
 *  - responsive src / url depend of image container size
 *  - lazyloading with preloading before showing
 *  - set aspect ratio background color behind image during lazyloading
 */

// Image function
export function ResponsiveImage(props: IProps) {
  // root ref and rect
  const rootRef = useRef(null);
  const rootRect = useBoundingClientRect(
    rootRef,
    EListener.ON_SCROLL_AND_RESIZE
  );

  // --------------------------------------------------------------------------- SELECT IMAGE

  // wrap responsive image state in memoise state
  const responsiveImage = useMemo((): IImage => {
    // exit if no data is set by props
    if (props.data == null) return;

    return getResponsiveImage({
      // image data
      pImages: props.data,
      // size of container depend of fix image size or component width
      pWidth: !!props.fixImageSize
        ? // select fix image
          props.fixImageSize
        : // else, select component width
          rootRect && rootRect.width
    });
  }, [props.data, rootRect]);

  // init separatly url of this object
  const [requiredURL, setRequiredURL] = useState<string>(transparentImageUrl);

  /**
   *  Start URL selector
   *  Depend of root width
   */
  useLayoutEffect(() => {
    // exit if no data is set by props
    if (props.data == null) return;

    // set required URL
    setRequiredURL(
      // if lazy is active
      props.lazy
        ? // set transparent image URL
          transparentImageUrl
        : // else, set automaticaly the image url
          responsiveImage?.url
    );
  }, [responsiveImage]);

  // --------------------------------------------------------------------------- LAZY

  // checker si l'image est preloaded ou non
  let [imageIsPreLoaded, setImageIsPreLoaded] = useState<boolean>(false);
  // checker le composant est dans le window
  const isInViewport = useIsInViewport(rootRef, false, props.lazyOffset);

  /**
   * Listen "isInViewPort" state
   * Only about lazy image
   */
  useEffect(() => {
    /**
     * When image is preloaded, pass state to true
     */
    const preloadedHandler = () => {
      setImageIsPreLoaded(true);
    };

    // if image is lazy and in viewport
    if (props.lazy && isInViewport && responsiveImage) {
      // if image is not preload
      if (!imageIsPreLoaded) {
        // preload : Create void image tag
        const $img = document.createElement("img");
        // set src attribute to start loading
        $img.src = responsiveImage.url;
        // show error
        if (!$img) throw new Error("preloadImage lazy // error");
        // The image is not loaded, attach handler
        $img.onload = function() {
          preloadedHandler();
        };
      }
    }
    // else, image isn't visible in viewport
    else {
      setImageIsPreLoaded(false);
    }

    return () => {
      // kill listener
      window.removeEventListener("load", preloadedHandler);
    };
  }, [isInViewport, imageIsPreLoaded, responsiveImage?.url]);

  /**
   * Listen ImageIsPreLoaded state
   * Only about lazy image
   */
  useEffect(() => {
    // if lazy is not activated by props, do not continue.
    if (!props.lazy) return;
    // if image is preloaded
    if (imageIsPreLoaded && responsiveImage) {
      // replace transparent image preloaded image
      setRequiredURL(responsiveImage?.url);
    }
    // if image isn't preloaded
    else {
      // set transparent image again
      setRequiredURL(transparentImageUrl);
    }
  }, [imageIsPreLoaded, responsiveImage]);

  // --------------------------------------------------------------------------- STYLES

  /**
   * Calc vertical Ratio
   * @param pResponsiveImage
   * @param pCustomRatio
   */
  const verticalRatio = useCallback(
    (pResponsiveImage: IImage, pCustomRatio: number): number => {
      // check
      if (!pResponsiveImage) return;

      // if fix vertical ratio is set
      if (!!pCustomRatio) {
        return pCustomRatio;
      }
      // else if responsive image as ratio
      else if (!!pResponsiveImage.ratio) {
        return pResponsiveImage.ratio;
      }
      // else if image as dimensions, calc ratio
      else if (!!responsiveImage.width && !!responsiveImage.height) {
        return responsiveImage.height / responsiveImage.width;
      }
      // else, there is no rato and no dimension
      else {
        return null;
      }
    },
    [responsiveImage, props.fixVerticalRatio]
  );

  /**
   * Background Color
   * Set color behind image
   * @param pBackgroundColor
   */
  const backgroundColorStyle = useCallback(
    (pBackgroundColor: string): CSSProperties => ({
      backgroundColor: !!pBackgroundColor ? pBackgroundColor : null
    }),
    [props.backgroundColor]
  );

  /**
   * Padding ratio style
   */
  const paddingRatioStyle = useCallback(
    (pRatio: number | null): CSSProperties => {
      return {
        // Padding ratio set to wrapper about to show background behind image
        paddingBottom:
          // If a custom ratio exist
          !!pRatio ? `${Math.round(pRatio * 100)}%` : null
      };
    },
    [verticalRatio]
  );

  /**
   * background-image style
   */
  const backgroundImageStyle = useCallback(
    (pRequiredURL: string): CSSProperties => ({
      // return background image
      backgroundImage: !!pRequiredURL ? `url("${pRequiredURL}")` : null
    }),
    [requiredURL]
  );

  /**
   * background-position style
   */
  const backgroundPositionStyle = useCallback(
    (pBackgroundPosition: number[]): CSSProperties => ({
      // return background position
      backgroundPosition: !!pBackgroundPosition
        ? `${pBackgroundPosition[0]}% ${pBackgroundPosition[1]}%`
        : null
    }),
    [props.backgroundPosition]
  );

  // image / cover child style
  const imageElementPosition: CSSProperties = {
    display: "block",
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    width: "100%",
    height: "100%"
  };

  // --------------------------------------------------------------------------- PREPARE RENDER

  /**
   * Image DOM render
   */
  const imageTagRender = (
    pClassBlock: string,
    pLazy: boolean,
    pURL: string,
    pAlt: string | null,
    pBackgroundColor?: string,
    pChildStyle?: CSSProperties
  ) => {
    // if not lazy and no background color is set
    if (!pLazy && !pBackgroundColor) {
      // return a simple image tag
      return (
        <img
          className={pClassBlock}
          ref={rootRef}
          src={pURL}
          alt={pAlt}
          style={pChildStyle}
        />
      );
    }
    // else, if lazy or a background color is set
    else {
      return (
        <div className={pClassBlock} ref={rootRef}>
          <div
            className={`${component}_wrapper`}
            style={{
              position: "relative",
              overflow: "hidden",
              ...backgroundColorStyle(pBackgroundColor),
              ...paddingRatioStyle(
                verticalRatio(responsiveImage, props.fixVerticalRatio)
              )
            }}
          >
            <img
              className={`${component}_image`}
              src={pURL}
              alt={pAlt}
              style={{
                // always object fit cover the image tag
                // in case padding ratio is bigger or smaller than the real ratio
                objectFit: "cover",
                ...imageElementPosition,
                ...pChildStyle
              }}
            />
          </div>
        </div>
      );
    }
  };

  /**
   * Background Image Render
   */
  const backgroundImageRender = (
    pClassBlock: string,
    pLazy: boolean,
    pUrl: string,
    pBackgroundPosition: number[],
    pChildren: ReactNode,
    pBackgroundColor: string,
    pChildStyle: CSSProperties
  ) => {
    // if not lazy and no background color
    if (!pLazy && !pBackgroundColor) {
      return (
        <div
          className={pClassBlock}
          ref={rootRef}
          children={pChildren}
          style={{
            ...backgroundImageStyle(pUrl),
            ...backgroundPositionStyle(pBackgroundPosition),
            ...pChildStyle
          }}
        />
      );
    }

    // else, if lazy or a background color is set
    else {
      return (
        <div className={pClassBlock} ref={rootRef}>
          <div
            className={`${component}_wrapper`}
            style={{
              position: "relative",
              overflow: "hidden",
              ...backgroundColorStyle(pBackgroundColor),
              ...paddingRatioStyle(
                verticalRatio(responsiveImage, props.fixVerticalRatio)
              )
            }}
          >
            <div
              className={`${component}_image`}
              children={pChildren}
              style={{
                ...backgroundImageStyle(pUrl),
                ...backgroundPositionStyle(pBackgroundPosition),
                ...imageElementPosition,
                ...pChildStyle
              }}
            />
          </div>
        </div>
      );
    }
  };

  // Prepare class block
  const classBlock = [
    // component class name
    component,
    // image type class
    `${component}-${props.type}`,
    // lazy class
    props.lazy
      ? `${component}-${imageIsPreLoaded ? "lazyloaded" : "lazyload"}`
      : "",
    // background color class
    !!props.backgroundColor ? `${component}-backgroundColor` : "",
    // props class
    props.classNames
  ]
    .filter(v => v)
    .join(" ");

  // --------------------------------------------------------------------------- RENDER

  // check
  if (!responsiveImage || !responsiveImage.url || !requiredURL) {
    return null;
  }
  // if classic image DOM
  else if (props.type === EImageType.IMAGE_TAG) {
    return imageTagRender(
      classBlock,
      props.lazy,
      requiredURL,
      props.alt,
      backgroundColorStyle(props.backgroundColor).backgroundColor,
      props.childStyle
    );
  }

  // if Background image on div
  else if (props.type === EImageType.BACKGROUND_IMAGE) {
    return backgroundImageRender(
      classBlock,
      props.lazy,
      requiredURL,
      props.backgroundPosition,
      props.children,
      backgroundColorStyle(props.backgroundColor).backgroundColor,
      props.childStyle
    );
  } else return null;
}
