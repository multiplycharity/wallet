import React, { useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Ionicons, Feather } from '@expo/vector-icons'

import QRIcon from '../components/QRIcon'
import Colors from '../constants/colors'
import ProfileScreen from '../screens/ProfileScreen'

const Stack = createStackNavigator()

const ProfileStackNavigator = () => {
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
            <TouchableOpacity onPress={() => {}} style={{ marginLeft: 18 }}>
              <QRIcon size={22}></QRIcon>
            </TouchableOpacity>
          )
        })}
      />
    </Stack.Navigator>
  )
}

export default ProfileStackNavigator
