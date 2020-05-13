import React, { useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import firebase from '../config/firebase'
import { useNavigation } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { loginSuccess } from '../redux/authReducer'

const LoadingScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const isSignedIn = useSelector(state => state.auth.isSignedIn)

  const checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(loginSuccess())
        navigation.navigate('Home')
      } else {
        navigation.navigate('SignIn')
      }
    })
  }

  useEffect(() => {
    checkIfLoggedIn()
  })

  return (
    <View style={{ flex: 1, justifyContentl: 'center', alignItems: 'center' }}>
      <ActivityIndicator size='large'></ActivityIndicator>
    </View>
  )
}

export default LoadingScreen
