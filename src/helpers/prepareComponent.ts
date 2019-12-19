import debug from "debug";

/**
 * @name prepareComponent
 * @description return component name and log debug tool
 * @param pComponentName
 */
export const prepareComponent = (
  pComponentName: string
): { component: string; log: debug } => {
  // get component name
  const component: string = pComponentName;
  // prepare log
  const log = debug(`${require("../../package.json").name}:${component}`);

  return {
    component,
    log
  };
};
