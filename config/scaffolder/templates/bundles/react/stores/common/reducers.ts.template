import { TCommonStoreActions, ECommonStoreActionsTypes } from "./actions";

// initial state interface
export interface IReduxCommonStoreState {
  currentPageName: string;
}

// define initial state
export const initialState = Object.freeze<IReduxCommonStoreState>({
  currentPageName: "init"
});

/**
 * common Store Reducers
 * @param pState
 * @param action
 */
export const commonReducers = (
  pState: IReduxCommonStoreState = initialState,
  action: TCommonStoreActions
): IReduxCommonStoreState => {
  // check each action type
  switch (action.type) {
    // if is set current step...
    case ECommonStoreActionsTypes.SET_CURRENT_STEP: {
      // return merge state + currentPageName
      return {
        ...pState,
        currentPageName: action.currentPageName
      };
    }
    default:
      return pState;
  }
};
