import API_ROUTE from "../../../../apiRoute";
import axios from 'axios'
import {  ANSWER_CREATE_SUCCESS, ANSWER_CREATE_ERROR, GET_ANSWERS_SUCCESS, GET_ANSWERS_ERROR,
    ANSWER_DELETE_SUCCESS, ANSWER_DELETE_ERROR, ANSWER_UPDATE_SUCCESS, ANSWER_UPDATE_ERROR, 
    BEFORE_STATE_ANSWER } from '../answerTypes'
import  {history} from '../../../../history'


export const fetchanswer = id => {

  return async dispatch => {

    dispatch({ type: BEFORE_STATE_ANSWER }) 

    try {
      const res = await axios.get(`${API_ROUTE}/answers_question/${id}`)
      dispatch({ 
        type: GET_ANSWERS_SUCCESS, 
        payload: {
          questionID: id,
          answers: res.data,
        }
      })
    } catch(err) {
      dispatch({ type: GET_ANSWERS_ERROR, payload: err.response.data.error })
    }
  }
}

export const createAnswer = (details, answerSuccess) => {
  return async (dispatch) => {
    dispatch({ type: BEFORE_STATE_ANSWER }) 
    try {
      const res  = await axios.post(`${API_ROUTE}/answers/${details.question_id}`, details)
     
      dispatch({ 
        type: ANSWER_CREATE_SUCCESS, 
        payload: {
          questionID: details.question_id,
          answer: res.data,
        }
      })
      answerSuccess()
      history.push(`/questions/${details.question_id}`);
    } catch(err){
      dispatch({ type: ANSWER_CREATE_ERROR, payload: err.response.data.error })
    }
  }
}

export const updateanswer = (updateDetails, updateSuccess) => {

  return async (dispatch) => {

    dispatch({ type: BEFORE_STATE_ANSWER }) 

    try {
      const res = await axios.put(`${API_ROUTE}/answers/${updateDetails.id}`, updateDetails)
      dispatch({ 
        type: ANSWER_UPDATE_SUCCESS,
        payload: {
            answer: res.data
        } 
      })
      updateSuccess()
      history.push(`/questions`);
    } catch(err) {
      dispatch({ type: ANSWER_UPDATE_ERROR, payload: err.response.data.error })
    }
  }
}

export const deleteAnswer = (details, deleteSuccess) => {

  return async (dispatch) => {

    dispatch({ type: BEFORE_STATE_ANSWER }) 

    try {
      await axios.delete(`${API_ROUTE}/answers/${details.id}`)
      dispatch({ 
        type: ANSWER_DELETE_SUCCESS,
        payload: {
          id: details.id,
          questionID: details.questionID,
        } 
      })
      deleteSuccess()
    } catch(err) {
      dispatch({ type: ANSWER_DELETE_ERROR, payload: err.response.data.error })
    }
  }
}