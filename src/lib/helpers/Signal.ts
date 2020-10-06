import { Disposable } from "../core/Disposable";

/**
 * Interface describing a listener.
 * @credits Original work by Alexis Bouhet - https://zouloux.com
 */
export interface IListener {
  scope: any;
  handler: () => any;
  once: boolean;
  id: number;
}

export class Signal extends Disposable {
  // ------------------------------------------------------------------------- LOCALS

  /**
   * Current listener id
   */
  private _id: number = 0;

  /**
   * All registered listeners
   */
  private _listeners: IListener[] = [];

  // ------------------------------------------------------------------------- GETTERS

  /**
   * Get total attached listeners
   */
  get length(): number {
    return this._listeners.length;
  }

  // ------------------------------------------------------------------------- CONSTRUCTION

  constructor() {
    super();
  }

  // ------------------------------------------------------------------------- ADDING / LISTENING

  /**
   * Add a listener. The handler will be called each time dispatch is called.
   * The handler will get the dispatch parameters.
   * Will return the id of the listening, for removing later.
   * @param pHandler Called when signal is dispatched.
   * @param pScope Scope to apply to handler. Let null to keep default.
   * @returns {number} The register index, to remove easily.
   */
  add(pHandler: (...rest) => any, pScope: any = null): number {
    return this.register(pScope, pHandler, false);
  }

  /**
   * Same as add, but will be removed when dispatched once.
   * @param pHandler Called when signal is dispatched.
   * @param pScope Scope to apply to handler. Let null to keep default.
   * @returns {number} The register index, to remove easily.
   */
  addOnce(pHandler: (...rest) => any, pScope: any = null): number {
    return this.register(pScope, pHandler, true);
  }

  /**
   * Register a listening.
   */
  private register(pScope: any, pHandler: () => any, pOnce: boolean): number {
    this._listeners.push({
      scope: pScope,
      handler: pHandler,
      once: pOnce,
      id: ++this._id,
    });

    return this._id;
  }

  // ------------------------------------------------------------------------- DISPATCHING

  /**
   * Dispatch the signal to all listeners. Will call all registered listeners with passed arguments.
   * Will return the list of listeners returns (listeners not returning anythings will be ignored)
   */
  dispatch(...rest): any[] {
    let results: any[] = [];
    let currentListener: IListener;
    let currentResult: any;
    let listenersToRemove: IListener[] = [];
    let listenerIndex = 0;

    results = this._listeners.filter((currentListener) => {
      // Call the listener
      currentResult = currentListener.handler.apply(
        currentListener.scope,
        rest
      );

      // If it's an once listener, mark as remove
      if (currentListener.once) {
        listenersToRemove.push(currentListener);
      }

      // If we have result, add it to the return package
      return currentResult != null;
    });

    // Remove all once listeners
    let total = listenersToRemove.length;
    for (listenerIndex = 0; listenerIndex < total; listenerIndex++) {
      this.remove(listenersToRemove[listenerIndex].handler);
    }

    // Return the result package of all listeners
    return results;
  }

  // ------------------------------------------------------------------------- REMOVING

  /**
   * Remove a listener by its id (returned by the add method) or by its handler reference.
   * Will return true if the listener is found and removed.
   */
  remove(pHandler: (...rest) => any): boolean;
  remove(pId: number): boolean;
  remove(pHandlerId: any): boolean {
    let newListeners: IListener[] = [];
    let currentListener: IListener;
    let listenerDeleted: boolean = false;

    // Browse all listeners
    const total = this._listeners.length;
    for (let listenerIndex = 0; listenerIndex < total; listenerIndex++) {
      // Target current listener
      currentListener = this._listeners[listenerIndex];

      // Check if we are on the listening to remove
      if (
        // We want to delete a listening by its handler reference
        (typeof pHandlerId == "function" &&
          currentListener.handler == pHandlerId) ||
        // We want to delete a listening by its id
        (typeof pHandlerId == "number" && currentListener.id == pHandlerId)
      ) {
        // We deleted it (don't add it to the new list)
        listenerDeleted = true;
      } else {
        // Add all listeners
        newListeners.push(currentListener);
      }
    }

    // Remap new listeners
    this._listeners = newListeners;

    // Return if we found and delete our listening
    return listenerDeleted;
  }

  // ------------------------------------------------------------------------- DESTRUCTION

  /**
   * Destroy this signal and every registered handler.
   */
  dispose(): void {
    this._listeners = null;
    super.dispose();
  }
}
