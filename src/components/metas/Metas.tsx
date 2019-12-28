import React, { useEffect } from "react";
import MetasManager, { IMetas } from "./MetasManager";

type IProps = IMetas;

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
