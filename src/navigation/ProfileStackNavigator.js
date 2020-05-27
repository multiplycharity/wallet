import React, { useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Ionicons, Feather } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'

import QRIcon from '../components/QRIcon'
import Colors from '../constants/colors'
import ProfileScreen from '../screens/ProfileScreen'
import { setIsScannerActive } from '../redux/screenReducer'
const screen = Dimensions.get('screen')
const Stack = createStackNavigator()

const ProfileStackNavigator = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content')
    }, [])
  )

  return (
    <Stack.Navigator
      screenOptions={{ headerStyle: { shadowColor: 'transparent' } }}
    >
      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
        options={({ route }) => ({
          headerTitle: null,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                dispatch(setIsScannerActive(false))
                navigation.navigate('ScannerModal')
              }}
              style={{ marginLeft: 18 }}
            >
              <QRIcon size={screen.height > 800 ? 24 : 20}></QRIcon>
            </TouchableOpacity>
          )
        })}
      />
    </Stack.Navigator>
  )
}

export default ProfileStackNavigator
