import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Button,
  Dimensions
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack'
import { Feather } from '@expo/vector-icons'

import Colors from '../constants/colors'
import HomeScreen from '../screens/HomeScreen'
import TransactionScreen from '../screens/TransactionScreen'
import MyCodeScreen from '../screens/MyCodeScreen'
import QRScannerScreen from '../screens/QRScannerScreen'
import ScannerModalScreen from '../screens/ScannerModalScreen'

import { useSelector, useDispatch } from 'react-redux'
import { toggleSearchBar } from '../redux/screenReducer'

import PaymentScreen from '../screens/PaymentScreen'
import WebViewScreen from '../screens/WebViewScreen'
import ModalHeader from '../components/ModalHeader'

import HomeStackNavigator from './HomeStackNavigator'
import ProfileStackNavigator from './ProfileStackNavigator'
import PaymentStackNavigator from './PaymentStackNavigator'
import TabNavigator from './TabNavigator'

const Stack = createStackNavigator()

const AppNavigator = ({ route, navigation }) => {
  return (
    <Stack.Navigator
      mode='modal'
      headerMode='none'
      screenOptions={({ route, navigation }) => ({ headerShown: false })}
    >
      <Stack.Screen
        name='Home'
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='MyCode'
        component={MyCodeScreen}
        options={({ route, navigation }) => ({
          headerShown: false
          // gestureEnabled: true,
          // cardOverlayEnabled: true,
          // gestureResponseDistance: {
          //   vertical: Dimensions.get('screen').height
          // },
          // headerStatusBarHeight:
          //   navigation.dangerouslyGetState().routes.indexOf(route) > 0
          //     ? 0
          //     : undefined,
          // ...TransitionPresets.ModalPresentationIOS,
        })}
      />

      <Stack.Screen
        name='QRScanner'
        component={QRScannerScreen}
        options={({ route, navigation }) => ({
          headerShown: false
        })}
      />
      <Stack.Screen
        name='ScannerModal'
        component={ScannerModalScreen}
        options={({ route, navigation }) => ({
          headerShown: false
        })}
      />
    </Stack.Navigator>
  )
}

export default AppNavigator
