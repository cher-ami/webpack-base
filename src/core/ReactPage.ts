import React from "react";
import { EPagePlayState, IActionParameters, IPage } from "../router/IPage";

/**
 * Default interface for page properties
 */
export interface ReactPageProps {
  action: string;
  parameters: IActionParameters;
}

export class ReactPage<Props, States> extends React.Component<Props, States>
  implements IPage {
  /**
   * Current play in / play out state of the page.
   * Use this state to disable features when animating.
   */
  get playState(): EPagePlayState {
    return this._playState;
  }
  protected _playState: EPagePlayState;

  /**
   * Constructor
   */
  constructor(pProps: Props, pContext: any) {
    // Relay
    super(pProps, pContext);

    // Call action
    this.action();
  }

  /**
   * Have to be override.
   * Action on this page.
   * Have to check props.action and props.params to show proper content.
   */
  action(pActionName?: string, pParameters?: IActionParameters) {}

  /**
   * Play intro animation.
   * Have to return a promise when animation is ended.
   * Animating lock is automatically enabled during animation.
   * Use animating lock to disable features when animating.
   * ex : if (this._animating) return
   * To implement animation, please override playInPromiseHandler.
   */
  playIn(...rest): Promise<any> {
    return new Promise(resolve => {
      // Lock animating
      this._playState = EPagePlayState.PLAYING_IN;

      // Execute page animation
      this.playInPromiseHandler(() => {
        // Unlock animating
        this._playState = EPagePlayState.VISIBLE;

        // Resolve promise
        resolve();
      });
    });
  }

  /**
   * Play outro animation.
   * Have to return a promise when animation is ended.
   * Animating lock is automatically enabled during animation.
   * Use animating lock to disable features when animating.
   * ex : if (this._animating) return
   * To implement animation, please override playOutPromiseHandler.
   */
  playOut(...rest): Promise<any> {
    return new Promise(resolve => {
      // Lock animating
      this._playState = EPagePlayState.PLAYING_OUT;

      // Execute page animation
      this.playOutPromiseHandler(() => {
        // Unlock animating
        this._playState = null;

        // Resolve promise
        resolve();
      });
    });
  }

  /**
   * Override this method to implement play in animation.
   * Call complete handler when animation is done.
   */
  protected playInPromiseHandler(pCompleteHandler: () => void) {
    pCompleteHandler();
  }

  /**
   * Override this method to implement play out animation.
   * Call complete handler when animation is done.
   */
  protected playOutPromiseHandler(pCompleteHandler: () => void) {
    pCompleteHandler();
  }
}
