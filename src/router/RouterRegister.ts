import { prepare } from "../helpers/prepare";
const { component, log } = prepare("RouterRegister");

/**
 * @name RouterRegister
 */
class RouterRegister {
  public _playIn: () => void;

  public registerPlayIn(handler: () => void) {
    this._playIn = handler;
  }
}

export default new RouterRegister();
