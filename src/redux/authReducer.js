// Action Types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'

export const SET_USER_SUCCESS = 'SET_USER_SUCCESS'
export const SET_USER_FAILURE = 'SET_USER_FAILURE'

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
  user: null,
  error: null,
  mnemonic: 'MNEMONIC'
}

// Action Creators
export const login = () => {
  return async (dispatch, getState) => {
    try {
      //Try sign in and get access token
      // const {accessToken, user} = await Google
      //   if (accessToken) {
      //     dispatch({ type: SET_ACCESS_TOKEN, payload: accessToken })
      //   }
      //   dispatch({ type: LOGIN_SUCCESS, payload: user })
    } catch (error) {
      console.log(error)
      dispatch({ type: LOGIN_FAILURE })
    }
  }
}

export const setAccessToken = accessToken => {
  return { type: SET_ACCESS_TOKEN, payload: accessToken }
}

export const setUserSuccess = user => {
  return { type: SET_USER_SUCCESS, payload: user }
}

export const setUserFailure = error => {
  return { type: SET_USER_FAILURE, payload: error }
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

// export const loginSuccess = accessToken => {
//   return async (dispatch, getState) => {
//     dispatch(setAccessToken(accessToken))
//     dispatch({ type: LOGIN_SUCCESS })
//   }
// }

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

// export const login = () => {
//   return async (dispatch, getState) => {
//     try {
//       const user = getState().user
//       console.log('user: ', user);

//       const response = await Firebase.auth().signInWithEmailAndPassword(
//         email,
//         password
//       )
//       dispatch({ type: LOGIN, payload: response.user })
//     } catch (e) {
//       console.log(e)
//     }
//   }
// }

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
    case SET_USER_SUCCESS:
      return { ...state, user: action.payload }
    case SET_USER_FAILURE:
      return { ...state, user: null, error: action.payload }
    case LOGIN_SUCCESS:
      return {
        ...state,
        isSignedIn: true
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
