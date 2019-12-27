import React, { useEffect } from "react";
import { IMetas, injectMetas, metaProperties } from "./injectMetas";

type IProps = IMetas;

/**
 * @name Metas
 */
function Metas(props: IProps) {
  /**
   * Update meta after render
   */
  useEffect(() => injectMetas(props, metaProperties), []);

  // return nothing
  return null;
}

export default Metas;
