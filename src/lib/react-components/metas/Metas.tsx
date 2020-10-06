import React, { useEffect } from "react";
import MetasManager, { TMetas } from "../../helpers/MetasManager";

type IProps = TMetas & {
  defaultMetas?: boolean;
};

Metas.defaultProps = {
  defaultMetas: false,
} as IProps;

/**
 * @name Metas
 * @description Metas component is a simple React middleware allowing to set
 * default or custom values in HTML metas page.
 */
export function Metas(props: IProps) {
  /**
   * Update meta after render
   */
  useEffect(() => {
    // if this is default metas
    if (props.defaultMetas) {
      // set default meta
      MetasManager.defaultMetas = props;
    } else {
      // inject custom metas
      MetasManager.inject(props);
    }
  }, []);

  // return nothing
  return null;
}
