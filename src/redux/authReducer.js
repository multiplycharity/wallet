// Action Types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
export const LOGOUT = 'LOGOUT'

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

export const loginSuccess = accessToken => {
  return async (dispatch, getState) => {
    dispatch(setAccessToken(accessToken))
    dispatch({ type: LOGIN_SUCCESS })
  }
}

// export const loginSuccess = accessToken => {
//   return { type: LOGIN_SUCCESS, payload: accessToken }
// }

export const loginFailure = (error = null) => {
  return { type: LOGIN_FAILURE, payload: error }
}

export const logout = () => {
  return { type: LOGOUT }
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

const initialState = {
  isSignedIn: false,
  accessToken: null,
  user: null,
  error: null,
  mnemonic: 'fdf'
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        mnemonic: 'Dfdsfdf',
        isSignedIn: true
      }
    case LOGIN_FAILURE:
      return { ...state, isSignedIn: false, error: action.payload }
    case LOGOUT:
      return { ...initialState }
    case SET_ACCESS_TOKEN:
      return { ...state, accessToken: action.payload }

    default:
      return state
  }
}

export default authReducer
