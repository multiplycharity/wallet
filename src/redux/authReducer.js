export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'

export const GOOGLE_SIGN_IN_SUCCESS = 'GOOGLE_SIGN_IN_SUCCESS'
export const GOOGLE_SIGN_IN_FAILURE = 'GOOGLE_SIGN_IN_FAILURE'

export const FIREBASE_SIGN_IN_SUCCESS = 'FIREBASE_SIGN_IN_SUCCESS'
export const FIREBASE_SIGN_IN_FAILURE = 'FIREBASE_SIGN_IN_FAILURE'

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'

const initialState = {
  isSignedIn: false,
  isSignedInFirebase: false,
  isSignedInGoogle: false,
  accessToken: null,
  error: null
}

export const setAccessToken = accessToken => {
  return { type: SET_ACCESS_TOKEN, payload: accessToken }
}

export const firebaseSignInSuccess = () => {
  return { type: FIREBASE_SIGN_IN_SUCCESS }
}

export const firebaseSignInFailure = error => {
  return { type: FIREBASE_SIGN_IN_FAILURE, payload: error }
}

export const googleSignInSuccess = () => {
  return { type: GOOGLE_SIGN_IN_SUCCESS }
}

export const googleSignInFailure = error => {
  return { type: GOOGLE_SIGN_IN_FAILURE, payload: error }
}

export const loginSuccess = () => {
  return { type: LOGIN_SUCCESS }
}

export const loginFailure = error => {
  return { type: LOGIN_FAILURE, payload: error }
}

export const logoutSuccess = () => {
  return { type: LOGOUT_SUCCESS }
}

export const logoutFailure = error => {
  return { type: LOGOUT_FAILURE, payload: error }
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOOGLE_SIGN_IN_SUCCESS:
      return { ...state, isSignedInGoogle: true }
    case GOOGLE_SIGN_IN_FAILURE:
      return { ...state, isSignedInGoogle: false, error: action.payload }
    case FIREBASE_SIGN_IN_SUCCESS:
      return { ...state, isSignedInFirebase: true }
    case FIREBASE_SIGN_IN_FAILURE:
      return { ...state, isSignedInFirebase: false, error: action.payload }
    case SET_ACCESS_TOKEN:
      return { ...state, accessToken: action.payload }
    case LOGIN_SUCCESS:
      return {
        ...state,
        isSignedIn: true,
        error: null
      }
    case LOGIN_FAILURE:
      return { ...state, isSignedIn: false, error: action.payload }
    case LOGOUT_SUCCESS:
      return { ...initialState }
    case LOGOUT_FAILURE:
      return { ...state, error: action.payload }

    default:
      return state
  }
}

export default authReducer
