import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { enableScreens } from 'react-native-screens'

import { createStackNavigator } from '@react-navigation/stack'

import ModalStackNavigator from './ModalStackNavigator'
// import LoginStackNavigator @TODO
import SignInScreen from '../screens/SignInScreen'

enableScreens()

const Stack = createStackNavigator()

const AppNavigator = () => {
  const [isSignedIn, setIsSignedIn] = useState(false)

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isSignedIn ? (
          <Stack.Screen name='SignIn' component={SignInScreen}></Stack.Screen>
        ) : (
          <Stack.Screen
            name='Home'
            component={ModalStackNavigator}
          ></Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
