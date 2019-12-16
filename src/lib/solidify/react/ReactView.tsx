import React, { Component, PureComponent } from "react";
import { findDOMNode } from "react-dom";

export class ReactView<Props, States> extends PureComponent<Props, States> {
  // ------------------------------------------------------------------------- PROPS

  public props: Props;
  public state: States;

  // ------------------------------------------------------------------------- INIT

  constructor(props: Props, context: any) {
    // Relay construction
    super(props, context);

    // Prepare component
    this.prepare();
  }

  /**
   * Prepare component before init
   */
  protected prepare() {}

  /**
   * Set or init new state for component.
   * Will securely set state if state is null.
   * Will update state with setState if state is already present.
   * @param pState New state
   * @param pCallback When state is ready
   */
  protected initState(pState: States, pCallback?: () => any): void {
    // TODO : Voir si ça ne fait pas doublon avec getInitialState !
    // http://brewhouse.io/blog/2015/03/24/best-practices-for-component-state-in-reactjs.html

    // If have no current state
    if (this.state == null) {
      // Securely set state
      this.state = pState;

      // Callback if needed
      pCallback && pCallback();
    }

    // Juste relay state udpate
    else super.setState(pState, pCallback);
  }

  // ------------------------------------------------------------------------- REFS

  /**
   * Get a DOM Node from a ref name
   * @param {string} pRefName Ref name declared as string.
   * @throws Error if ref does not exists. To get refs without throws, you can use $ method.
   * @returns DOM Node
   */
  protected getNode(pRefName: string): HTMLElement {
    // Check if this ref exists
    if (!(pRefName in this.refs)) {
      throw new Error(`ReactView.getComponent // Ref ${pRefName} not found.`);
    }

    // Target DOM node
    return (findDOMNode(this.refs[pRefName]) as any) as HTMLElement;
  }

  /**
   * Get a DOM Node collection from ref names.
   * Will not throw anything if ref does not exists.
   * @param pRefNames List of all refs to target. Will fail silently if a ref is not found.
   * @returns A DOM element collection.
   */
  protected $(pRefNames: string[] | string): HTMLElement[] {
    // Patch array argument if only a string is given
    if (typeof pRefNames === "string") {
      pRefNames = [pRefNames];
    }

    // Browse ref list
    const collection = [];
    pRefNames.map(refName => {
      // Do not throw if ref is not found, ignore
      if (!(refName in this.refs)) return;

      // Add to collection
      collection.push((findDOMNode(this.refs[refName]) as any) as HTMLElement);
    });

    // Return clean collection
    return collection;
  }

  /**
   * Get a Component from a ref name.
   * @param {string} pRefName Ref name declared as string.
   * @returns {ComponentType} React component typed with generics
   */
  protected getComponent<ComponentType extends Component>(
    pRefName: string
  ): ComponentType {
    // Check if this ref exists
    if (!(pRefName in this.refs)) {
      throw new Error(`ReactView.getComponent // Ref ${pRefName} not found.`);
    }

    // Get ref from refs collection
    let ref = this.refs[pRefName];

    // Check if this ref is not a DOM node
    if ("tagName" in ref) {
      throw new Error(
        `ReactView.getComponent // Trying to get a DOM node as a React component from ref ${pRefName}.`
      );
    }

    // Return correctly type component
    return ref as ComponentType;
  }

  /**
   * Usage : ref={ r => this.refNodes('refName', index, r) }
   * Ref object in a array of components and as an Element Collection.
   * Will store an Component collection called _name in this.
   * Will store an Element collection called $name in this.
   *
   * IMPORTANT : Can break if react behavior changes over time. Read content to know more.
   *
   * @param pRefName Name of the array and to collection. Will be prefixed by _ for component array and by $ for Element collection.
   * @param pComponent The component sent by react ref.
   * @param pKey Key of the component, as number only
   */
  protected refNodes(
    pRefName: string,
    pKey: number,
    pComponent: Component | HTMLElement
  ): void {
    // Get collections names
    const componentCollectionName = "_" + pRefName;
    const elementsCollectionNames = "$" + pRefName;

    // IMPORTANT : This implementation ca change if react behavior changes.
    // IMPORTANT : Here is the trick, we remove every thing when a component in unmounted
    // IMPORTANT : It works because for now, react do this on every key, but it can change

    // IMPORTANT : We do this because this is the only way to be sure that array do not contain old references
    if (!(componentCollectionName in this) || pComponent == null) {
      this[componentCollectionName] = [];
      this[elementsCollectionNames] = [];
    }

    // If we have a component
    if (pComponent != null) {
      // Store mounted component in collection
      this[componentCollectionName][pKey] = pComponent;

      // Get DOM Node for this component
      this[elementsCollectionNames][pKey] = findDOMNode(pComponent);
    }
  }
}
