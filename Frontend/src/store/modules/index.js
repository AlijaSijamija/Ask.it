import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "./auth/reducer/authReducer";
import { questionsState } from "./questions/reducer/questionsReducer";
import { likesState } from './likes/reducer/likesReducer'
import { answersState } from "./answers/reducer/answersReducer";

const authPersistConfig = {
  key: "root",
  storage,
};

const reducer = combineReducers({
  QuestionsState: questionsState,
  LikesState: likesState,
  AnswersState: answersState,
  Auth: persistReducer(authPersistConfig, authReducer),
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

const persistor = persistStore(store);

export { store, persistor };
