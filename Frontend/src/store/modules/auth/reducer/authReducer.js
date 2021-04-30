import { 
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  BEFORE_USER_STATE,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR,
  FETCH_USERS,
  FETCH_USERS_ERROR,
} from "../authTypes";
import isEmpty from "lodash/isEmpty";

export const initState = {
  isAuthenticated: false,
  currentUser: {},
  userData: {},
  userId: null,
  isLoading: false,
  isUpdatingUser: false,
  authError: null,
  authSuccess: null,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return {
        ...state,
        userData: action.payload,
        isLoading: false,
      };
    case FETCH_USERS_ERROR:
      return {
        ...state,
        usersError: action.error,
        isLoading: false,
      };
    case BEFORE_USER_STATE:
      return {
        ...state,
        userError: null,
        isUpdatingUser: true,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        signupError: null,
        loginError: null,
      };
    case SIGNUP_ERROR:
      return {
        ...state,
        isLoading: false,
        signupError: action.payload,
        loginError: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentUser: action.payload.authToken,
        userId: action.payload.user_id,
        isAuthenticated: !isEmpty(action.payload),
        loginError: null,
        signupError: null,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        isLoading: false,
        loginError: action.payload,
        signupError: null,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        currentUser: {},
        userData: {},
        userId: null,
        logoutError: null,
        isLoading: false,
        signupError: null,
        loginError: null,
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        isUpdatingUser: false,
        userData: action.payload,
        userError: null,
        authSuccessUser: "Details Updated",
      };
    case UPDATE_USER_ERROR:
      return {
        ...state,
        isUpdatingUser: false,
        userError: action.payload,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        currentUser: {},
        isLoading: false,
        authSuccessUser: "User Deleted",
      };
    case DELETE_USER_ERROR:
      return {
        ...state,
        isLoading: false,
        userError: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
