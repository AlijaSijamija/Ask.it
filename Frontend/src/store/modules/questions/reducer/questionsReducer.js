import { BEFORE_STATE_QUESTION, FETCH_QUESTIONS, FETCH_QUESTIONS_ERROR, CREATE_QUESTION_SUCCESS, 
    CREATE_QUESTION_ERROR, GET_QUESTION_SUCCESS, GET_QUESTION_ERROR, DELETE_QUESTION_SUCCESS, 
    DELETE_QUESTION_ERROR, FETCH_AUTH_QUESTIONS, FETCH_AUTH_QUESTIONS_ERROR} from '../questionsTypes'

export const initState = {
  questions: [],
  authQuestions: [],
  question: {},
  questionsError: null,
  isLoading: false,
}

export const questionsState = (state = initState, action) => {

  const { payload, type } = action
  switch(type) {

    case BEFORE_STATE_QUESTION:
      return {
        ...state,
        questionsError: null,
        isLoading: true,
      }
    case FETCH_QUESTIONS:
      return { 
        ...state, 
        questions: payload,
        isLoading: false,
      }
      
    case FETCH_QUESTIONS_ERROR:
      return { 
        ...state, 
        questionsError: payload,
        isLoading: false 
      }

    case FETCH_AUTH_QUESTIONS:
      return { 
        ...state, 
        authQuestions: payload,
        isLoading: false,
      }

    case FETCH_AUTH_QUESTIONS_ERROR:
      return { 
        ...state, 
        questionsError: payload,
        isLoading: false 
      }

    case GET_QUESTION_SUCCESS:
      return { 
        ...state, 
        question: payload,
        questionsError: null,
        isLoading: false  
      }

    case GET_QUESTION_ERROR:
      return { 
        ...state, 
        questionsError: payload,
        isLoading: false 
      }

    case CREATE_QUESTION_SUCCESS:
      return { 
        ...state, 
        questions: [payload, ...state.questions],
        authquestions: [payload, ...state.authquestions],
        questionsError: null,
        isLoading: false  
      }

    case CREATE_QUESTION_ERROR:
      return { 
        ...state, 
        questionsError: payload,
        isLoading: false  
      }

     case DELETE_QUESTION_SUCCESS:
      return { 
        ...state, 
        questions: state.questions.filter(question => question.id !== payload.deletedID),
        authquestions: state.authquestions.filter(question => question.id !== payload.deletedID),
        questionsError: null,
        isLoading: false   
      }

    case DELETE_QUESTION_ERROR:
      return { 
        ...state, 
        questionsError: payload,
        isLoading: false  
      }

    default:
      return state
  }
}