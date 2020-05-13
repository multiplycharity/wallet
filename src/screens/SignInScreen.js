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
  logout
} from '../redux/authReducer'

import { useSelector, useDispatch } from 'react-redux'

const isUserEqual = (googleUser, firebaseUser) => {
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
}

const onSignIn = googleUser => {
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
    unsubscribe()
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      var credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.idToken,
        googleUser.accessToken
      )

      // Sign in with credential from the Google user.
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(response => {
          console.log('responseUser: ', response.user)
          console.log('User signed in successfully.')

          if (response.user.uid) {
            const {
              uid,
              email,
              displayName,
              phoneNumber,
              photoURL
            } = response.user
            let user = { uid, email, displayName, phoneNumber, photoURL }

            db.collection('users')
              .doc(response.user.uid)
              .set(user)
              .catch(function (error) {
                console.error('Error adding document: ', error)
              })
          }
        })
        .catch(function (error) {
          console.log('error: ', error)
          // Handle Errors here.
          var errorCode = error.code
          var errorMessage = error.message
          // The email of the user's account used.
          var email = error.email
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential
          // ...
        })
    } else {
      console.log('User already signed-in Firebase.')
    }
  })
}

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
      onSignIn(response)
      return response.accessToken
    } else {
      return { canceled: true }
    }
  } catch (error) {
    console.warn(err)
    return { error }
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
  const [accessToken, setAccessToken] = useState('')
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [mnemonic, setMnemonic] = useState('')

  const accessTokenRedux = useSelector(state => state.auth.accessToken)
  console.log('accessTokenRedux: ', accessTokenRedux)

  const isSignedInRedux = useSelector(state => state.auth.isSignedIn)
  console.log('isSignedInRedux: ', isSignedInRedux)

  const mnemonicRedux = useSelector(state => state.auth.mnemonic)
  console.log('mnemonicRedux: ', mnemonicRedux)

  const dispatch = useDispatch()

  const handleSignIn = async () => {
    const res = await signInWithGoogleAsync()
    console.log('res: ', res)
    if (res.canceled) {
      dispatch(loginFailure('Signin canceled'))
    } else if (res.error) {
      dispatch(loginFailure(res.error))
    } else {
      setAccessToken(res)
      setIsSignedIn(true)
      dispatch(loginSuccess(res))
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'pink',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
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

      {!accessTokenRedux ? (
        <Button
          style={{}}
          title='Sign in with Google'
          onPress={handleSignIn}
        ></Button>
      ) : null}

      {accessTokenRedux ? (
        <>
          <Button
            title='Get files'
            onPress={() => getMnemonic(accessToken)}
            style={{ marginTop: 20 }}
          ></Button>
          <Button
            title='Sign out'
            onPress={() => dispatch(logout())}
            style={{ marginTop: 20 }}
          ></Button>
        </>
      ) : null}
    </SafeAreaView>
  )
}

export default SignInScreen

const styles = StyleSheet.create({})
