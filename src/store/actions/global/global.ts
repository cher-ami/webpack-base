import { EGlobalActionTypes } from "./global.types";

export const setCurrentStep = currentStep => dispatch => {
  dispatch({
    type: EGlobalActionTypes.SET_CURRENT_STEP,
    currentStep
  });
};
