import React from 'react'
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import { Ionicons, Feather } from '@expo/vector-icons'
import Colors from '../constants/colors'

import HomeScreen from '../screens/HomeScreen'
import PaymentScreen from '../screens/PaymentScreen'
import ProfileScreen from '../screens/ProfileScreen'
import MyCodeScreen from '../screens/MyCodeScreen'

import TabNavigator from './TabNavigator'

const ProfileStack = createStackNavigator()

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name='Profile'
        component={TabNavigator}
        options={({ route }) => ({
          headerTitleStyle: { fontSize: 29 },
          headerTitleAlign: 'center'
        })}
      />
    </ProfileStack.Navigator>
  )
}

export default ProfileStackNavigator
