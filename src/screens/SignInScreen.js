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

import { useSelector, useDispatch } from 'react-redux'

const SignInScreen = () => {
  const dispatch = useDispatch()

  const accessTokenRedux = useSelector(state => state.auth.accessToken)
  const isSignedInRedux = useSelector(state => state.auth.isSignedIn)
  const mnemonicRedux = useSelector(state => state.auth.mnemonic)
  const userRedux = useSelector(state => state.auth.user)
  const errorRedux = useSelector(state => state.auth.error)

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {errorRedux && typeof errorRedux !== 'undefined' ? (
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 50,
            paddingHorizontal: 40,
            color: 'red'
          }}
        >
          {errorRedux}
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
          onPress={() => dispatch(signInWithGoogle())}
        ></Button>
        //) : null
      }

      {accessTokenRedux ? (
        <>
          <Button
            title='Get files'
            onPress={() => dispatch(getWalletFromDrive(accessTokenRedux))}
            style={{ marginTop: 20 }}
          ></Button>
          <Button
            title='Sign out'
            onPress={() => {
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
