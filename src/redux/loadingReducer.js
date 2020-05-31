import {
  LOGIN_STARTED,
  LOGIN_SUCCESS,
  GOOGLE_SIGN_IN_FAILURE,
  LOGIN_FAILURE,
  FIREBASE_SIGN_IN_FAILURE
} from './authReducer'

const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case LOGIN_STARTED:
      return true
    case LOGIN_SUCCESS:
      return false
    case GOOGLE_SIGN_IN_FAILURE:
      return false
    case FIREBASE_SIGN_IN_FAILURE:
      return false
    // case SEND_TX_PENDING:
    //   return true
    // case SEND_TX_ERROR:
    //   return false
    // case SEND_TX_SUCCESS:
    //   return false
    default:
      return state
  }
}

export default loadingReducer
