import { AppState } from "../../store";
import { setCurrentStep } from "../../store/actions/global/global";
import HomePage from "./HomePage";
import { connect } from "react-redux";

const mapStateToProps = (state: AppState) => {
  return {
    currentStep: state.global.currentStep
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentStep: currentStep => dispatch(setCurrentStep(currentStep))
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true
});

export default connector(HomePage);
