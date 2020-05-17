import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Button,
  StatusBar
} from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { createStackNavigator } from '@react-navigation/stack'
import { Feather } from '@expo/vector-icons'

import Colors from '../constants/colors'
import HomeScreen from '../screens/HomeScreen'
import TransactionScreen from '../screens/TransactionScreen'
import MyCodeScreen from '../screens/MyCodeScreen'

import { useSelector, useDispatch } from 'react-redux'
import { toggleSearchBar } from '../redux/screenReducer'

import TabNavigator from './TabNavigator'

const HomeStack = createStackNavigator()
const HomeStackNavigator = props => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content')
    }, [])
  )

  const { route } = props

  const navigation = useNavigation()

  const dispatch = useDispatch()

  return (
    <HomeStack.Navigator initialRouteName='Home'>
      <HomeStack.Screen
        name='Home'
        component={TabNavigator}
        options={({ route }) => ({
          headerTitleStyle: { fontSize: 21 },
          headerTitleAlign: 'left'
        })}
      />
      <HomeStack.Screen
        name='Transaction'
        component={TransactionScreen}
        options={({ navigation, route }) => {
          return {
            headerTitle: null,
            headerLeft: () => {
              return (
                <TouchableOpacity
                  style={{ marginLeft: 16 }}
                  onPress={() => {
                    if (navigation.canGoBack()) {
                      navigation.popToTop()
                    }
                  }}
                >
                  <Feather name='arrow-left' size={24} />
                </TouchableOpacity>
              )
            }
          }
        }}
      />
    </HomeStack.Navigator>
  )
}

export default HomeStackNavigator
