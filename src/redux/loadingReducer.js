import {
  LOGIN_STARTED,
  LOGIN_SUCCESS,
  GOOGLE_SIGN_IN_FAILURE,
  LOGIN_FAILURE,
  FIREBASE_SIGN_IN_FAILURE
} from './authReducer'

import {
  CLAIM_STARTED,
  CLAIM_SUCCESS,
  CLAIM_ERROR,
  LINK_GENERATION_STARTED,
  LINK_GENERATION_SUCCESS,
  LINK_GENERATION_ERROR
} from './linkdropReducer'

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

    // case CLAIM_STARTED:
    //   return true
    // case CLAIM_SUCCESS:
    //   return false
    // case CLAIM_ERROR:
    //   return false

    // case LINK_GENERATION_STARTED:
    //   return true
    // case LINK_GENERATION_SUCCESS:
    //   return false
    // case LINK_GENERATION_ERROR:
    //   return false

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
