import React from 'react'

import { NavigationContainer } from '@react-navigation/native'

import { enableScreens } from 'react-native-screens'

import HomeStack from './HomeStack'
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
