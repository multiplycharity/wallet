import * as Google from 'expo-google-app-auth'
import firebase from '../config/firebase'
import { firestore as db } from '../config/firebase'

import { CLIENT_ID, API_KEY } from 'react-native-dotenv'
import { isUserEqual } from './helpers'
import {
  createUserSuccess,
  createUserFailure,
  updateUserFailure,
  updateUserSuccess,
  getWalletFromDrive
} from './userReducer'

import { throwError, clearError } from './errorReducer'

export const LOGIN_STARTED = 'LOGIN_STARTED'
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
  accessToken: '',
  error: null
}

export const setAccessToken = accessToken => {
  return { type: SET_ACCESS_TOKEN, payload: accessToken }
}

export const firebaseSignInSuccess = () => {
  return { type: FIREBASE_SIGN_IN_SUCCESS }
}

export const firebaseSignInFailure = error => dispatch => {
  dispatch(throwError(error, 'Update user failed'))

  dispatch({
    type: FIREBASE_SIGN_IN_FAILURE,
    payload: error
  })
}

export const googleSignInSuccess = () => {
  return { type: GOOGLE_SIGN_IN_SUCCESS }
}

export const googleSignInFailure = error => dispatch => {
  dispatch(throwError(error, 'Update user failed'))

  dispatch({
    type: GOOGLE_SIGN_IN_FAILURE,
    payload: error
  })
}

export const loginStarted = () => dispatch => {
  dispatch({ type: LOGIN_STARTED })
}

export const loginSuccess = () => dispatch => {
  dispatch({ type: LOGIN_SUCCESS })
}

export const loginFailure = error => dispatch => {
  dispatch(throwError(error, 'Update user failed'))
  dispatch({
    type: LOGIN_FAILURE,
    payload: error
  })
}

export const logoutSuccess = () => {
  return { type: LOGOUT_SUCCESS }
}

export const logoutFailure = error => dispatch => {
  dispatch(throwError(error, 'Update user failed'))
  dispatch({
    type: LOGOUT_FAILURE,
    payload: error
  })
}

export const signOut = () => dispatch => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(logoutSuccess())
      dispatch({ type: 'RESET_APP' })
    })
    .catch(error => {
      dispatch(logoutFailure(error))
      throw new Error(error)
    })
}

export const signInWithGoogle = () => async dispatch => {
  try {
    dispatch(loginStarted())

    const response = await Google.logInAsync({
      iosClientId: CLIENT_ID,
      scopes: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/drive.appdata'
      ]
    })

    if (response.type === 'success') {
      dispatch(googleSignInSuccess())
      dispatch(setAccessToken(response.accessToken))
      await dispatch(getWalletFromDrive(response.accessToken))
      await dispatch(signInWithFirebase(response))
    } else {
      dispatch(googleSignInFailure({ message: 'Canceled' }))
    }
  } catch (error) {
    dispatch(googleSignInFailure(error))
    throw new Error(error)
  }
}

export const signInWithFirebase = googleUser => dispatch => {
  var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
    unsubscribe()

    // Check if already signed-in Firebase with the correct user
    if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token
      let credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.idToken,
        googleUser.accessToken
      )

      // Sign in with credential from the Google user
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(result => {
          dispatch(firebaseSignInSuccess())

          if (result.user.uid) {
            const {
              uid,
              email,
              displayName,
              phoneNumber,
              photoURL
            } = result.user

            let user = {
              uid,
              email,
              name: displayName,
              phone: phoneNumber,
              photoUrl: photoURL
            }

            // If new user
            if (result.additionalUserInfo.isNewUser) {
              db.collection('users')
                .doc(result.user.uid)
                .set({ ...user, createdAt: Date.now() })
                .then(() => {
                  dispatch(createUserSuccess({ ...user }))
                  dispatch(loginSuccess())
                })
                .catch(error => {
                  dispatch(createUserFailure(error))
                  throw new Error(error)
                })
            } else {
              // If existing user
              db.collection('users')
                .doc(result.user.uid)
                .update({ lastLoggedIn: Date.now() })
                .then(() => {
                  dispatch(updateUserSuccess({ ...user }))
                  dispatch(loginSuccess())
                })
                .catch(error => {
                  dispatch(updateUserFailure(error))
                  throw new Error(error)
                })
            }
          }
        })
        .catch(error => {
          dispatch(firebaseSignInFailure(error))
          let credential = error.credential
          console.log('Credential: ', credential)
          throw new Error(error)
        })
    } else {
      dispatch(firebaseSignInSuccess())
      console.log('User already signed in firebase')
    }
  })
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
