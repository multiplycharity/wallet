import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import { Ionicons, Feather } from '@expo/vector-icons'
import Colors from '../constants/colors'

import HomeScreen from '../screens/HomeScreen'
import PaymentScreen from '../screens/PaymentScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SignInScreen from '../screens/SignInScreen'

import HomeStackNavigator from './HomeStackNavigator'
import PaymentStackNavigator from './PaymentStackNavigator'
import ProfileStackNavigator from './ProfileStackNavigator'

import { useDispatch } from 'react-redux'

const getRouteName = route =>
  route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen || 'Home'

const getTabBarOptions = route => {
  const routeName = getRouteName(route)

  const defaultOptions = {
    showLabel: false,
    keyboardHidesTabBar: true,
    style: { borderTopWidth: 0 }
  }
  switch (routeName) {
    case 'Payment':
      return {
        ...defaultOptions,
        activeTintColor: Colors.Black,
        inactiveTintColor: Colors.Gray500
        // activeTintColor: Colors.White,
        // inactiveTintColor: Colors.Gray400,
        // style: { ...defaultOptions.style }
        // backgroundColor: Colors.Blue
      }
    default:
      return {
        ...defaultOptions,
        activeTintColor: Colors.Black,
        inactiveTintColor: Colors.Gray500
      }
  }
}

const Tab = createBottomTabNavigator()

const TabNavigator = props => {
  const { navigation, route } = props

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused, color, size }) => {
            let iconName
            if (route.name === 'HomeStack') {
              iconName = 'home'
            } else if (route.name === 'PaymentStack') {
              iconName = 'dollar-sign'
            } else if (route.name === 'ProfileStack') {
              iconName = 'user'
            }
            return <Feather name={iconName} size={size} color={color} />
          }
        }
      }}
      tabBarOptions={getTabBarOptions(route)}
    >
      <Tab.Screen
        name='HomeStack'
        component={HomeStackNavigator}
        options={({ navigation, route }) => {
          return {
            tabBarVisible: !(route.state?.index > 0)
          }
        }}
      />
      <Tab.Screen name='PaymentStack' component={PaymentStackNavigator} />
      <Tab.Screen name='ProfileStack' component={ProfileStackNavigator} />
    </Tab.Navigator>
  )
}

export default TabNavigator
