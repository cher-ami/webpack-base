import debug from "debug";

/**
 * @name prepareComponent
 * @description return component name and log debug tool
 * @param pComponentName
 */
export const prepareComponent = (
  pComponentName: string
): { componentName: string; log: debug } => {
  // get component name
  const componentName: string = pComponentName;
  // prepare log
  const log = debug(
    `${require("../../../package.json").name}:${componentName}`
  );

  return {
    componentName,
    log
  };
};
