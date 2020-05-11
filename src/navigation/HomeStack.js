import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Button
} from 'react-native'

import { createStackNavigator } from '@react-navigation/stack'
import { Feather } from '@expo/vector-icons'

import Colors from '../constants/colors'
import HomeScreen from '../screens/HomeScreen'
import TransactionScreen from '../screens/TransactionScreen'

import { useSelector, useDispatch } from 'react-redux'
import { toggleSearchBar } from '../redux/reducer'

const Stack = createStackNavigator()

const HomeStack = props => {
  const { navigation, route } = props

  if (route.state && route.state.index > 0) {
    navigation.setOptions({ tabBarVisible: false })
  } else navigation.setOptions({ tabBarVisible: true })

  const dispatch = useDispatch()

  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerStyle: {},
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 21 },
          headerRight: () => {
            return (
              <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => {
                  dispatch(toggleSearchBar())
                }}
              >
                <Feather name='search' size={22} />
              </TouchableOpacity>
            )
          }
        }}
      />
      <Stack.Screen
        name='Transaction'
        component={TransactionScreen}
        options={({ navigation, route }) => {
          return {
            headerTitle: null,
            headerLeft: () => {
              return (
                <TouchableOpacity
                  style={{ marginLeft: 14 }}
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
    </Stack.Navigator>
  )
}

export default HomeStack
