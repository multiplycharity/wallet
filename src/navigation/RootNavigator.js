import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { enableScreens } from 'react-native-screens'

import { createStackNavigator } from '@react-navigation/stack'

import AppNavigator from './AppNavigator'
import SignInScreen from '../screens/SignInScreen'

enableScreens()

const Stack = createStackNavigator()

const RootNavigator = () => {
  const [isSignedIn, setIsSignedIn] = useState(false)

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='SignIn'
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen name='SignIn' component={SignInScreen}></Stack.Screen>
        <Stack.Screen name='Home' component={AppNavigator}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator
