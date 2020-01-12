import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { commonReducers } from "./common/reducers";
import thunk from "redux-thunk";

const combinedReducers = combineReducers({
  common: commonReducers
  // add your new store here...
});

export default function configureStore(initialState = {}) {
  const enhancer = composeWithDevTools(applyMiddleware(thunk));
  const store = createStore(combinedReducers, enhancer);

  // return combine store
  return store;
}

export type AppState = ReturnType<typeof combinedReducers>;
