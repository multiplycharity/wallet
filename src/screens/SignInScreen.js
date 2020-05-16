import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView
} from 'react-native'
import Button from '../components/Button'

import { firestore as db } from '../config/firebase'
import { CLIENT_ID, API_KEY } from 'react-native-dotenv'
import { ethers } from 'ethers'

import {
  loginFailure,
  loginSuccess,
  setAccessToken,
  logout,
  firebaseSignInSuccess,
  firebaseSignInFailure,
  googleSignInSuccess,
  googleSignInFailure,
  logoutSuccess,
  logoutFailure,
  signInWithGoogle,
  signOut
} from '../redux/authReducer'

import {
  createUserSuccess,
  createUserFailure,
  updateUserSuccess,
  updateUserFailure,
  createWalletSuccess,
  createWalletFailure,
  getWalletSuccess,
  getWalletFailure,
  getWalletFromDrive
} from '../redux/userReducer'

import { useSelector, useDispatch, useStore } from 'react-redux'
import { throwError } from '../redux/errorReducer'

const SignInScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const isSignedIn = useSelector(state => state.auth.isSignedIn)
  const accessToken = useSelector(state => state.auth.accessToken)

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text
        style={{
          textAlign: 'left',
          fontSize: 12,
          color: 'navy',
          fontWeight: '500',
          marginBottom: 50,
          paddingHorizontal: 40
        }}
      >
        {accessToken}
      </Text>

      {
        //!accessTokenRedux ?
        <Button
          style={{}}
          title='Sign in with Google'
          onPress={() => dispatch(signInWithGoogle())}
        ></Button>
        //) : null
      }

      {isSignedIn ? (
        <>
          <Button
            title='Get files'
            onPress={() => dispatch(getWalletFromDrive(accessToken))}
            style={{ marginTop: 20 }}
          ></Button>
          <Button
            title='Sign out'
            onPress={() => {
              navigation.navigate('SignIn')
              dispatch(signOut())
            }}
            style={{ marginTop: 20 }}
          ></Button>
        </>
      ) : null}
    </SafeAreaView>
  )
}

export default SignInScreen
