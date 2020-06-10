import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Button,
  StatusBar,
  Dimensions
} from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { createStackNavigator } from '@react-navigation/stack'
import { Feather } from '@expo/vector-icons'

import Colors from '../constants/colors'
import HomeScreen from '../screens/HomeScreen'
import TransactionScreen from '../screens/TransactionScreen'

import { useSelector, useDispatch } from 'react-redux'
import { toggleSearchBar } from '../redux/screenReducer'

const screen = Dimensions.get('screen')

const HomeStack = createStackNavigator()

const HomeStackNavigator = props => {
  const [timer, setTimer] = useState(null)

  const { navigation, route } = props

  const dispatch = useDispatch()

  return (
    <HomeStack.Navigator
      initialRouteName='Home'
      screenOptions={{ headerStyle: { shadowColor: 'transparent' } }}
    >
      <HomeStack.Screen
        name='Home'
        component={HomeScreen}
        options={({ route }) => ({
          headerTitleStyle: { fontSize: screen.height > 800 ? 21 : 18 },
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
