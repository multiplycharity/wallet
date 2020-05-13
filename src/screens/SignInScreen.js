import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native'
import Button from '../components/Button'

import * as Google from 'expo-google-app-auth'
import firebase from '../config/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

import { CLIENT_ID } from 'react-native-dotenv'

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
  console.log('Google Auth Response', googleUser)
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
      console.log('credential: ', credential)

      // Sign in with credential from the Google user.
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(response => {
          console.log('res: ', response)
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
    const result = await Google.logInAsync({
      iosClientId: CLIENT_ID,
      scopes: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/drive.appdata'
      ]
    })

    console.log('Access token:', result.accessToken)
    console.log('User', result.user)

    if (result.type === 'success') {
      console.log('success')
      onSignIn(result)
      return result.accessToken
    } else {
      return { cancelled: true }
    }
  } catch (err) {
    return { error: true, err }
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

  //   console.log('files: ', files)
}

const SignInScreen = () => {
  const [accessToken, setAccessToken] = useState('')
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [mnemonic, setMnemonic] = useState('')

  const handleSignIn = async () => {
    const res = await signInWithGoogleAsync()
    if (res.cancelled) {
      console.warn('Cancelled')
    } else if (res.error) {
      console.warn(res.err)
    } else {
      console.warn(res)
      setAccessToken(res)
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'pink',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 50 }}>
        {accessToken}
      </Text>
      <Button title='Sign in with Google' onPress={handleSignIn}></Button>

      {accessToken ? (
        <Button
          title='Get files'
          onPress={() => getMnemonic(accessToken)}
          style={{ marginTop: 20 }}
        ></Button>
      ) : null}
    </View>
  )
}

export default SignInScreen

const styles = StyleSheet.create({})
