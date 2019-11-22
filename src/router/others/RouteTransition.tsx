import React, { ReactNode, useLayoutEffect, useRef } from "react";
import { EPlayState } from "../../types";

interface IProps {
  children: ReactNode;
  playIn: (pRef) => void;
  playOut: (pRef) => void;
  playState: EPlayState;
}

function RouteTransition(props: IProps) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (props.playState === EPlayState.PLAY_IN) {
      props?.playIn?.(rootRef);
    }

    if (props.playState === EPlayState.PLAY_OUT) {
      props?.playOut?.(rootRef);
    }
  }, [props.playIn, props.playOut, props.playState]);

  return <div ref={rootRef}>{props.children}</div>;
}

export default RouteTransition;
