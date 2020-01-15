import debug from "debug";

/**
 * @name prepare
 * @description return component name and log debug tool
 * @param pComponentName
 */
export const prepare = (
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
