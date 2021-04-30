import API_ROUTE from "../../../../apiRoute";
import axios from "axios";
import {
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  FETCH_USERS_ERROR,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR,
  FETCH_USERS,
} from "../authTypes";
import { history } from "../../../../history";

export const SignIn = (credentials) => {
  return async (dispatch) => {
    axios
      .post(`${API_ROUTE}/login`, credentials)
      .then((res) => {
        const authToken = res.data;
        const base64Url = authToken.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        const userId = JSON.parse(window.atob(base64));
        let user_id = userId.user_id;

        dispatch({ type: LOGIN_SUCCESS, payload: { user_id, authToken } });
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      })
      .catch((ex) => {
        dispatch({ type: LOGIN_ERROR, payload: ex.message });
      });
  };
};

export const SignOut = () => {
  return (dispatch) => {
    dispatch({ type: LOGOUT_SUCCESS });
    delete axios.defaults.headers.common["Authorization"];
    history.replace("/login");
  };
};

export const SignUp = (newUser) => {
  return async (dispatch) => {
    await axios
      .post(`${API_ROUTE}/users`, newUser)
      .then(() => {
        dispatch({ type: SIGNUP_SUCCESS });
        history.push("/login");
      })
      .catch((ex) => {
        dispatch({ type: SIGNUP_ERROR, payload: ex.message });
      });
  };
};

export const updateUser = (userId, updateUser) => {
  return async (dispatch) => {
    axios
      .put(`${API_ROUTE}/users/${userId}`, updateUser)
      .then((res) => {
        dispatch({ type: UPDATE_USER_SUCCESS, payload: res.data });
      })
      .catch((ex) => {
        dispatch({ type: UPDATE_USER_ERROR, payload: ex.message });
      });
  };
};

export const deleteUser = (id) => {
  return async (dispatch) => {
    axios
      .delete(`${API_ROUTE}/users/${id}`)
      .then((res) => {
        dispatch({ type: DELETE_USER_SUCCESS, payload: res.data.response });
        window.location.href = "/";
      })
      .catch((ex) => {
        dispatch({ type: DELETE_USER_ERROR, payload: ex.message });
      });
  };
};

export const getUser = (userId) => {
  return async (dispatch) => {
    axios
      .get(`${API_ROUTE}/users/${userId}`)
      .then((res) => {
        dispatch({ type: FETCH_USERS, payload: res.data });
      })
      .catch((e) => {
        dispatch({ type: FETCH_USERS_ERROR, error: e.message });
      });
  };
};
