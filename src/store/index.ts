import { createStore, combineReducers, applyMiddleware } from "redux";
import { global } from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const combinedReducers = combineReducers({
  global
});

export default function configureStore(initialState = {}) {
  const enhancer = composeWithDevTools(applyMiddleware(thunk));
  const store = createStore(combinedReducers, enhancer);

  return store;
}

export type AppState = ReturnType<typeof combinedReducers>;
