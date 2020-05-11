import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Button
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { createStackNavigator } from '@react-navigation/stack'
import { Feather } from '@expo/vector-icons'

import Colors from '../constants/colors'
import HomeScreen from '../screens/HomeScreen'
import TransactionScreen from '../screens/TransactionScreen'
import MyCodeScreen from '../screens/MyCodeScreen'

import { useSelector, useDispatch } from 'react-redux'
import { toggleSearchBar } from '../redux/reducer'

import TabNavigator from './TabNavigator'
import PaymentScreen from '../screens/PaymentScreen'

import HomeStackNavigator from './HomeStackNavigator'
import ProfileStackNavigator from './ProfileStackNavigator'

const ModalStack = createStackNavigator()

const ModalStackNavigator = () => {
  return (
    <ModalStack.Navigator mode='modal' headerMode='none'>
      <ModalStack.Screen name='Home' component={HomeStackNavigator} />
      <ModalStack.Screen name='MyCode' component={MyCodeScreen} />
    </ModalStack.Navigator>
  )
}

export default ModalStackNavigator
