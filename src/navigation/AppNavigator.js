import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { enableScreens } from 'react-native-screens'

import ModalStackNavigator from './ModalStackNavigator'

enableScreens()

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <ModalStackNavigator></ModalStackNavigator>
    </NavigationContainer>
  )
}

export default AppNavigator
