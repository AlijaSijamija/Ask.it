import API_ROUTE from "../../../../apiRoute";
import axios from 'axios'
import {  LIKE_CREATE_SUCCESS, 
    LIKE_CREATE_ERROR, 
    GET_LIKES_SUCCESS, 
    GET_LIKES_ERROR, 
    LIKE_DELETE_SUCCESS, 
    LIKE_DELETE_ERROR } from '../likeTypes'

export const fetchLikes = id => {

  return async dispatch => {
    try {
      const res = await axios.get(`${API_ROUTE}/likes/${id}`)
      dispatch({ 
        type: GET_LIKES_SUCCESS, 
        payload: {
          questionID: id,
          likes: res.data,
        }
      })
    } catch(err) {
      dispatch({ type: GET_LIKES_ERROR, payload: err.response.data.error })
    }
  }
}

export const createLike = details => {
  return async (dispatch) => {
    try {
      const res  = await axios.post(`${API_ROUTE}/likes/${details.question_id}`, details)
      dispatch({ 
        type: LIKE_CREATE_SUCCESS, 
        payload: {
          questionID: details.question_id,
          oneLike: res.data,
        }
      })
    } catch(err){
      dispatch({ type: LIKE_CREATE_ERROR, payload: err.response.data.error })
    }
  }
}


export const deleteLike = details => {
  return async (dispatch) => {
    try {
      await axios.delete(`${API_ROUTE}/likes/${details.id}`)
      dispatch({ 
        type: LIKE_DELETE_SUCCESS, 
        payload: {
          likeID: details.id,
          questionID: details.questionID,
        }
      })
    } catch(err){
      dispatch({ type: LIKE_DELETE_ERROR, payload: err.response.data.error })
    }
  }
}