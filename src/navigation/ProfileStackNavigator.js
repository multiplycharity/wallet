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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
        options={({ route }) => ({
          headerTitleStyle: { fontSize: 29 },
          headerTitleAlign: 'center'
        })}
      />
    </Stack.Navigator>
  )
}

export default ProfileStackNavigator
