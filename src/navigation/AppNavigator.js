import React from 'react'

import { NavigationContainer } from '@react-navigation/native'

import { enableScreens } from 'react-native-screens'

import TabNavigator from './TabNavigator'

enableScreens()

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator></TabNavigator>
    </NavigationContainer>
  )
}

export default AppNavigator
