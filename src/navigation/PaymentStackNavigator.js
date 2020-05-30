import React, { useCallback, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'

import { Ionicons, Feather } from '@expo/vector-icons'
import Colors from '../constants/colors'

import HomeScreen from '../screens/HomeScreen'
import PaymentScreen from '../screens/PaymentScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ChoosePaymentRecipientScreen from '../screens/ChoosePaymentRecipientScreen'

import QRIcon from '../components/QRIcon'
import { setIsScannerActive } from '../redux/screenReducer'

const Stack = createStackNavigator()

const screen = Dimensions.get('screen')

const PaymentStackNavigator = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  useEffect(() => {}, [])

  useFocusEffect(
    useCallback(() => {
      // navigation.navigate('Payment')
      StatusBar.setBarStyle('dark-content')
    }, [])
  )

  return (
    <Stack.Navigator
      screenOptions={{ headerStyle: { shadowColor: 'transparent' } }}
    >
      <Stack.Screen
        name='Payment'
        component={PaymentScreen}
        options={({ route }) => ({
          headerTitle: null,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                dispatch(setIsScannerActive(true))
                navigation.navigate('ScannerModal')
              }}
              style={{ marginLeft: 16 }}
            >
              <Feather
                name='maximize'
                size={screen.height > 800 ? 28 : 24}
              ></Feather>
            </TouchableOpacity>
          )
        })}
      />
    </Stack.Navigator>
  )
}

export default PaymentStackNavigator
