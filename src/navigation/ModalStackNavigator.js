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

import TabNavigator from './TabNavigator'
import PaymentScreen from '../screens/PaymentScreen'
import WebViewScreen from '../screens/WebViewScreen'
import ModalHeader from '../components/ModalHeader'

import HomeStackNavigator from './HomeStackNavigator'
import ProfileStackNavigator from './ProfileStackNavigator'

const ModalStack = createStackNavigator()

const ModalStackNavigator = ({ route, navigation }) => {
  // const screen = useScreenDimensions()

  return (
    <ModalStack.Navigator
      mode='modal'
      screenOptions={({ route, navigation }) => ({ headerShown: false })}
    >
      <ModalStack.Screen
        name='Home'
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <ModalStack.Screen
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

      <ModalStack.Screen
        name='QRScanner'
        component={QRScannerScreen}
        options={({ route, navigation }) => ({
          headerShown: false
        })}
      />
      <ModalStack.Screen
        name='ScannerModal'
        component={ScannerModalScreen}
        options={({ route, navigation }) => ({
          headerShown: false
        })}
      />

      {/* <ModalStack.Screen
        name='WebView'
        component={WebViewScreen}
        options={{
          header: () => (
            <ModalHeader
              backgroundColor={Colors.White}
              color={Colors.Gray300}
            />
          )
        }}
      />*/}
    </ModalStack.Navigator>
  )
}

export default ModalStackNavigator
