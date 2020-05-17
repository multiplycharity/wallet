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

import PaymentStackNavigator from '../navigation/PaymentStackNavigator'

import QRIcon from '../components/QRIcon'
import { useDispatch } from 'react-redux'

import { signOut } from '../redux/authReducer'
import ProfileStackNavigator from './ProfileStackNavigator'

const getRouteName = route =>
  route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen || 'Home'

const getHeaderTitle = route => {
  const routeName = getRouteName(route)
  switch (routeName) {
    case 'Home':
      return 'Home'
    case 'Payment':
      return 'Payment'
    case 'Profile':
      return 'Profile'
  }
}

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
        activeTintColor: Colors.White,
        inactiveTintColor: Colors.Gray400,
        style: { ...defaultOptions.style, backgroundColor: Colors.Blue }
      }
    default:
      return {
        ...defaultOptions,
        activeTintColor: Colors.Black,
        inactiveTintColor: Colors.Gray500
      }
  }
}

const getNavigationOptions = route => {
  const routeName = getRouteName(route)

  const defaultOptions = {
    headerShown: true,
    headerTitle: getHeaderTitle(route),
    headerLeft: null,
    headerStyle: { shadowColor: 'transparent' }
  }

  switch (routeName) {
    case 'Profile':
      return {
        ...defaultOptions,
        headerShown: true,
        headerTitle: null,
        headerLeft: () => (
          <TouchableOpacity onPress={() => {}} style={{ marginLeft: 16 }}>
            <QRIcon size={22}></QRIcon>
          </TouchableOpacity>
        )
      }
    case 'Payment':
      return { ...defaultOptions, headerShown: false }
    default:
      return { ...defaultOptions }
  }
}

const Tab = createBottomTabNavigator()

const TabNavigator = props => {
  const { navigation, route } = props

  const dispatch = useDispatch()
  const routeName = getRouteName(route)

  React.useLayoutEffect(() => {
    navigation.setOptions(getNavigationOptions(route))
    // setNavigationOptions({ navigation, route })
  }, [navigation, route])

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
      tabBarOptions={getTabBarOptions(route)}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Payment' component={PaymentStackNavigator} />
      <Tab.Screen name='Profile' component={ProfileStackNavigator} />
    </Tab.Navigator>
  )
}

export default TabNavigator
