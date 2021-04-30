import API_ROUTE from "../../../../apiRoute";
import axios from "axios";
import {
  BEFORE_STATE_QUESTION,
  FETCH_QUESTIONS,
  FETCH_QUESTIONS_ERROR,
  GET_QUESTION_ERROR,
  CREATE_QUESTION_ERROR,
  DELETE_QUESTION_SUCCESS,
  GET_QUESTION_SUCCESS,
  DELETE_QUESTION_ERROR,
  FETCH_AUTH_QUESTIONS,
  FETCH_AUTH_QUESTIONS_ERROR,
  CREATE_QUESTION_SUCCESS,
} from "../questionsTypes";
import { history } from "../../../../history";

export const fetchQuestions = () => {
  return (dispatch) => {
    axios
      .get(`${API_ROUTE}/questions`)
      .then((res) => {
        dispatch({ type: FETCH_QUESTIONS, payload: res.data });
      })
      .catch((err) => {
        dispatch({
          type: FETCH_QUESTIONS_ERROR,
          payload: err.response ? err.respons.data.error : "",
        });
      });
  };
};

export const fetchQuestion = (id) => {
  return async (dispatch) => {
    dispatch({ type: BEFORE_STATE_QUESTION });

    try {
      const res = await axios.get(`${API_ROUTE}/questions/${id}`);
      dispatch({ type: GET_QUESTION_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({ type: GET_QUESTION_ERROR, payload: err.response.data.error });
      history.push("/"); //incase the user manually enter the param that dont exist
    }
  };
};

export const fetchAuthQuestions = (id) => {
  return async (dispatch) => {
    dispatch({ type: BEFORE_STATE_QUESTION });
    try {
      const res = await axios.get(`${API_ROUTE}/questions_user/${id}`);
      dispatch({ type: FETCH_AUTH_QUESTIONS, payload: res.data });
    } catch (err) {
      dispatch({
        type: FETCH_AUTH_QUESTIONS_ERROR,
        payload: err.response.data.error,
      });
    }
  };
};

export const createQuestion = (createQuestion) => {
  return async (dispatch) => {
    dispatch({ type: BEFORE_STATE_QUESTION });
    try {
      axios.post(`${API_ROUTE}/questions`, createQuestion);
      history.replace("/");
    } catch (err) {
      dispatch({
        type: CREATE_QUESTION_ERROR,
        payload: err.response.data.error,
      });
    }
  };
};

export const deleteQuestion = (id) => {
  return async (dispatch) => {
    dispatch({ type: BEFORE_STATE_QUESTION });

    try {
      const res = await axios.delete(`${API_ROUTE}/questions/${id}`);
      dispatch({
        type: DELETE_QUESTION_SUCCESS,
        payload: {
          deletedID: id,
          message: res.data,
        },
      });
      history.push("/");
    } catch (err) {
      dispatch({
        type: DELETE_QUESTION_ERROR,
        payload: err.response.data.error,
      });
    }
  };
};
