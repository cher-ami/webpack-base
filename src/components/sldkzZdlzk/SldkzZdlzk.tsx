import "./SldkzZdlzk.less";
import React from "react";
import { classBlock } from "../../helpers/className";
import { prepare } from "../../helpers/prepare";

interface IProps {
  classNames?: string[];
}

// prepare
const { component, log } = prepare("SldkzZdlzk");

/**
 * @name SldkzZdlzk
 */
function SldkzZdlzk(props: IProps) {
  // --------------------------------------------------------------------------- PREPARE

  // --------------------------------------------------------------------------- RENDER

  return (
    <div className={classBlock([component, props.classNames])}>{component}</div>
  );
}

export default SldkzZdlzk;
