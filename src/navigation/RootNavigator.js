import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { enableScreens } from 'react-native-screens'
import { Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import AppNavigator from './AppNavigator'
import SignInScreen from '../screens/SignInScreen'

import { Linking } from 'expo'

enableScreens()

const Stack = createStackNavigator()

const prefix = Linking.makeUrl('/')

const RootNavigator = () => {
  const [isSignedIn, setIsSignedIn] = useState(false)

  const linking = {
    prefixes: [prefix],
    config: {
      Claim: 'claim'
    }
  }

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator
        initialRouteName='SignIn'
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen name='SignIn' component={SignInScreen}></Stack.Screen>
        <Stack.Screen name='HomeStack' component={AppNavigator}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator
