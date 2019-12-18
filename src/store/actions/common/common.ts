import { ECommonActionTypes } from "./common.types";

export const setCurrentStep = currentStep => dispatch => {
  dispatch({
    type: ECommonActionTypes.SET_CURRENT_STEP,
    currentStep
  });
};
