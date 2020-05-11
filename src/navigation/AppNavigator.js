import React from 'react'

import { NavigationContainer } from '@react-navigation/native'

import { enableScreens } from 'react-native-screens'

import HomeStack from './HomeStack'

enableScreens()

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <HomeStack></HomeStack>
    </NavigationContainer>
  )
}

export default AppNavigator

// <TabNavigator></TabNavigator>
