import React from 'react'
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/HomeScreen'
import PaymentScreen from '../screens/PaymentScreen'
import ProfileScreen from '../screens/ProfileScreen'

import { Ionicons, Feather } from '@expo/vector-icons'
import Colors from '../constants/colors'

import HomeStack from './HomeStack'

//Payment stack

const PaymentStack = createStackNavigator()

const PaymentStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name='Payment' component={PaymentScreen} />
    </HomeStack.Navigator>
  )
}

//Profile stack

const ProfileStack = createStackNavigator()

const ProfileStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name='Profile' component={ProfileScreen} />
    </HomeStack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Home') {
            iconName = 'home'
          } else if (route.name === 'Payment') {
            iconName = 'dollar-sign'
          } else if (route.name === 'Profile') {
            iconName = 'user'
          }
          return <Feather name={iconName} size={size} color={color} />
        }
      })}
      tabBarOptions={{
        activeTintColor: Colors.Black,
        inactiveTintColor: Colors.Gray500,
        showLabel: false,
        keyboardHidesTabBar: true
      }}
    >
      <Tab.Screen name='Home' component={HomeStack} />
      <Tab.Screen name='Payment' component={PaymentStackScreen} />
      <Tab.Screen name='Profile' component={ProfileStackScreen} />
    </Tab.Navigator>
  )
}

export default TabNavigator
