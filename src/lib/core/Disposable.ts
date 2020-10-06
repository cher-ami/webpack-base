/**
 * @credits Original work by Alexis Bouhet - https://zouloux.com
 */
export interface IDisposable {
  isDisposed: boolean;

  dispose(): void;
}

/**
 * Extends this if you need to have a destroyable object.
 * The only method dispose have to be overrided.
 * Do your destruction stuff inside this method.
 * Please always call super.dispose() to relay until this class.
 * The isDisposed have to be modified so you can check in the console if an element is well disposed.
 */
export class Disposable implements IDisposable {
  /**
   * If this object is destroyed
   */
  private _isDisposed: boolean = false;

  /**
   * If this object is destroyed
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Destroy
   */
  dispose(): void {
    this._isDisposed = true;
  }
}
