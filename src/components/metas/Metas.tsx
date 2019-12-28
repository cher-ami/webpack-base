import React, { useEffect } from "react";
import MetasManager, { TMetas } from "./MetasManager";

type IProps = TMetas;

/**
 * @name Metas
 */
function Metas(props: IProps) {
  /**
   * Update meta after render
   */
  useEffect(() => MetasManager.inject(props), []);

  // return nothing
  return null;
}

export default Metas;
