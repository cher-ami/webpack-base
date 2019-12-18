import { AppState } from "../../store";
import HomePage from "./HomePage";
import { connect } from "react-redux";
import { setCurrentStep } from "../../store/actions/common/common";

// TODO: interface AppState not working here
/**
 * Map state to component props
 * @param state
 */
const mapStateToProps = (state: any) => {
  return {
    currentStep: state.common.currentStep
  };
};

/**
 * Map dispatch function to component props
 * @param dispatch
 */
const mapDispatchToProps = dispatch => {
  return {
    setCurrentStep: currentStep => dispatch(setCurrentStep(currentStep))
  };
};

/**
 * Connector use on default export bellow
 */
const connector = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true
});

export default connector(HomePage);
