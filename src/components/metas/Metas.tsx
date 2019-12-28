import React, { useEffect } from "react";
import MetasManager, { IMetas } from "./injectMetas";

type IProps = IMetas;

/**
 * @name Metas
 */
function Metas(props: IProps) {
  /**
   * Update meta after render
   */
  useEffect(() => MetasManager.instance.injectMetas(props), []);

  // return nothing
  return null;
}

export default Metas;
