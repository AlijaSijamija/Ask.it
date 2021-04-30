import { BEFORE_STATE_ANSWER, ANSWER_CREATE_SUCCESS, ANSWER_CREATE_ERROR, GET_ANSWERS_SUCCESS, 
    GET_ANSWERS_ERROR, ANSWER_DELETE_SUCCESS, ANSWER_DELETE_ERROR, ANSWER_UPDATE_SUCCESS, 
    ANSWER_UPDATE_ERROR } from '../answerTypes'

export const initState = {
  answerItems : [],
  isLoading: false,
  answerSuccess: false
}


export const answersState = (state = initState, action) => {
  
  const { payload, type }  = action;
  switch(type) {

    case BEFORE_STATE_ANSWER:
      return {
        ...state,
        answersError: null,
        isLoading: true,
        answerSuccess: false
      }

    case GET_ANSWERS_SUCCESS:
      return { 
        ...state, 
        answerItems: [...state.answerItems, { questionID: payload.questionID, answers: payload.answers  } ],
        isLoading: false,
        answersError: null,
      }

    case GET_ANSWERS_ERROR:
      return { 
        ...state, 
        answerError: payload, 
        isLoading: false,
      }

    case ANSWER_CREATE_SUCCESS:
      return { 
        ...state, 
        answerItems: state.answerItems.map(answerItem => 
                    Number(answerItem.questionID) === payload.questionID ? 
                    {...answerItem, answers: [payload.answer, ...answerItem.answers]} : answerItem
        ),
        message: "The answer is added",
        isLoading: false,
        answerSuccess: true
     }

    case ANSWER_CREATE_ERROR:
      return { 
        ...state, 
        answersError: payload, 
        isLoading: false,
        answerSuccess: false
      }

    case ANSWER_UPDATE_SUCCESS:
      return { 
        ...state, 
        answerItems: state.answerItems.map(answerItem => 
          Number(answerItem.questionID) === payload.answer.question_id ? 
          {...answerItem, answers: answerItem.answers.map(answer => answer.id === payload.answer.id  ? 
          {...answer, body: payload.answer.body } : answer  ) } : answerItem
        ),
        answersError: null, 
        isLoading: false,
        answerSuccess: true,
      }

    case ANSWER_UPDATE_ERROR:
      return { 
        ...state, 
        answersError: payload, 
        isLoading: false,
        answerSuccess: false
      }

    case ANSWER_DELETE_SUCCESS:
      return { 
        ...state, 
        answerItems: state.answerItems.map(answerItem => 
          Number(answerItem.questionID) === payload.questionID ? 
          {...answerItem, answers: answerItem.answers.filter(({id}) => id !== payload.id ) } : answerItem
        ),
        answersError: null, 
        isLoading: false,
        answerSuccess: true,
      }

    case ANSWER_DELETE_ERROR:
      return { 
        ...state, 
        answersError: payload, 
        isLoading: false,
        answerSuccess: false
      }
    default:
      return state
  }
}