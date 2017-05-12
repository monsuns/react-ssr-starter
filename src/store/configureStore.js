import {createStore, applyMiddleware} from "redux";
import thunkMiddleware from "redux-thunk";
import {createLogger} from "redux-logger";
import rootReducer from "./reducers";

let createStoreWithMiddleware = null;
if (process.env.NODE_ENV === "local" || process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "stg") {
  createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    createLogger()
  )(createStore);
} else {
  createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
}

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, ...initialState);
}
