import * as Google from 'expo-google-app-auth'
import firebase from '../config/firebase'
import { firestore as db } from '../config/firebase'
import { CLIENT_ID, API_KEY } from 'react-native-dotenv'

export const isUserEqual = (googleUser, firebaseUser) => {
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

export const onSignIn = googleUser => {
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
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

          // Save user to firestore
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
              .catch(error => {
                console.error('Error adding document: ', error)
              })
          }
        })
        .catch(error => {
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

export const signInWithGoogleAsync = async () => {
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
  } catch (err) {
    console.warn(err)
    return { error }
  }
}
