import ArticlePage from "./ArticlePage";
import { connect } from "react-redux";
import { setcurrentPageName } from "../../stores/common/actions";

/**
 * Map state to component props
 * @param state
 */
const mapStateToProps = (state: any) => {
  return {
    currentPageName: state.common.currentPageName
  };
};

/**
 * Map dispatch function to component props
 * @param dispatch
 */
const mapDispatchToProps = dispatch => {
  return {
    setcurrentPageName: currentPageName =>
      dispatch(setcurrentPageName(currentPageName))
  };
};

/**
 * Connector use on default export bellow
 */
const connector = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true
});

export default connector(ArticlePage);
