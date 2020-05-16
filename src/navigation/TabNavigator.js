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
import SignInScreen from '../screens/SignInScreen'

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

const isHeaderShown = route => {
  const routeName = getRouteName(route)
  if (routeName === 'Profile') return false

  return true
}

const Tab = createBottomTabNavigator()

const TabNavigator = props => {
  const { navigation, route } = props

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getHeaderTitle(route),
      headerShown: isHeaderShown(route)
    })
  }, [navigation, route])

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // tabBarVisible: getTabBarVisibility(route),
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
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Payment' component={PaymentScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default TabNavigator
