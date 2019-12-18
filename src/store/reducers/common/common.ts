import { Action } from "../../types";
import { ECommonActionTypes } from "../../actions/common/common.types";

export interface IReduxGlobalState {
  currentStep: string;
}

export const initialState = Object.freeze<IReduxGlobalState>({
  currentStep: "init"
});

export default (
  state: IReduxGlobalState = initialState,
  action: Action
): IReduxGlobalState => {
  switch (action.type) {
    case ECommonActionTypes.SET_CURRENT_STEP: {
      return {
        ...state,
        currentStep: action.currentStep
      };
    }

    // default
    default:
      return state;
  }
};
