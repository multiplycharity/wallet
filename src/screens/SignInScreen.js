import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView
} from 'react-native'
import Button from '../components/Button'

import * as Google from 'expo-google-app-auth'
import firebase from '../config/firebase'
import { firestore as db } from '../config/firebase'
import { CLIENT_ID, API_KEY } from 'react-native-dotenv'

import {
  loginFailure,
  loginSuccess,
  setAccessToken,
  createUserSuccess,
  createUserFailure,
  updateUserSuccess,
  updateUserFailure,
  logout,
  firebaseSignInSuccess,
  firebaseSignInFailure,
  googleSignInSuccess,
  googleSignInFailure,
  logoutSuccess,
  logoutFailure
} from '../redux/authReducer'

import { useSelector, useDispatch } from 'react-redux'

const isUserEqual = (googleUser, firebaseUser) => {
  try {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true
        }
      }
    }
    return false
  } catch (error) {
    console.warn(error)
    return false
  }
}

const getMnemonic = async accessToken => {
  const baseApiUrl = 'https://www.googleapis.com/drive/v3'

  //   const files = await fetch(`https://www.googleapis.com/drive/v3/files`)

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&key=${API_KEY}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    }
  )
  console.log('res: ', await res.json())
}

const SignInScreen = () => {
  const accessTokenRedux = useSelector(state => state.auth.accessToken)
  const isSignedInRedux = useSelector(state => state.auth.isSignedIn)
  const mnemonicRedux = useSelector(state => state.auth.mnemonic)
  const userRedux = useSelector(state => state.auth.user)
  const errorRedux = useSelector(state => state.auth.error)

  const dispatch = useDispatch()

  const signInWithGoogleAsync = async () => {
    try {
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
        await onSignIn(response)
        return response.accessToken
      } else {
        dispatch(googleSignInFailure({ message: 'Canceled' }))
        return { canceled: true }
      }
    } catch (error) {
      dispatch(googleSignInFailure(error))
      console.warn(error)
      return { error }
    }
  }

  const onSignIn = async googleUser => {
    var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
      unsubscribe()

      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        let credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        )

        // Sign in with credential from the Google user.
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
                displayName,
                phoneNumber,
                photoURL
              }

              // If new user
              if (result.additionalUserInfo.isNewUser) {
                db.collection('users')
                  .doc(result.user.uid)
                  .set({ ...user, createdAt: Date.now() })
                  .then(() => {
                    dispatch(createUserSuccess(user))
                    dispatch(loginSuccess())
                  })
                  .catch(error => {
                    dispatch(createUserFailure(error))
                    console.error('Error adding document: ', error)
                  })
              } else {
                // If existing user
                db.collection('users')
                  .doc(result.user.uid)
                  .update({ lastLoggedIn: Date.now() })
                  .then(() => {
                    dispatch(updateUserSuccess(user))
                    dispatch(loginSuccess())
                  })
                  .catch(error => {
                    dispatch(updateUserFailure(error))
                    console.error(error.message)
                  })
              }
            }
          })
          .catch(error => {
            console.log('Failed to sign in firebase:', error)
            dispatch(firebaseSignInFailure(error))
            let credential = error.credential
            console.log('Credential: ', credential)
          })
      } else {
        dispatch(firebaseSignInSuccess())
        console.log('User already signed in firebase')
      }
    })
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {errorRedux && typeof errorRedux.message !== 'undefined' ? (
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 50,
            paddingHorizontal: 40,
            color: 'red'
          }}
        >
          {errorRedux.message}
        </Text>
      ) : null}

      <Text
        style={{
          fontSize: 14,
          fontWeight: '500',
          marginBottom: 50,
          paddingHorizontal: 40
        }}
      >
        {accessTokenRedux}
      </Text>

      {
        //!accessTokenRedux ?
        <Button
          style={{}}
          title='Sign in with Google'
          onPress={signInWithGoogleAsync}
        ></Button>
        //) : null
      }

      {accessTokenRedux ? (
        <>
          <Button
            title='Get files'
            onPress={() => getMnemonic(accessTokenRedux)}
            style={{ marginTop: 20 }}
          ></Button>
          <Button
            title='Sign out'
            onPress={() => {
              firebase
                .auth()
                .signOut()
                .then(() => {
                  dispatch(logoutSuccess())
                })
                .catch(error => {
                  console.log('Failed to log out')
                  dispatch(logoutFailure(error))
                })
            }}
            style={{ marginTop: 20 }}
          ></Button>
        </>
      ) : null}
    </SafeAreaView>
  )
}

export default SignInScreen

const styles = StyleSheet.create({})
