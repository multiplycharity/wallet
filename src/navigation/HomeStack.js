import React from 'react'
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/HomeScreen'

import { Feather } from '@expo/vector-icons'
import Colors from '../constants/colors'

const Stack = createStackNavigator()

const Header = props => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text style={{ fontSize: 21, fontWeight: '600', marginLeft: 20 }}>
          Home
        </Text>
        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => {}}>
          <Feather name='search' size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerTransparent: true,
          headerStyle: {
            height: 104 // Specify the height of your custom header
          },
          header: Header
          // headerTitleAlign: 'left',
          // headerTitleStyle: { fontSize: 24, fontWeight: '600' },
          // headerRight: () => {
          //   return (
          //     <TouchableOpacity style={{ marginRight: 14 }} onPress={() => {}}>
          //       <Feather name='search' size={20} />
          //     </TouchableOpacity>
          //   )
          // }
        }}
      />
    </Stack.Navigator>
  )
}

export default HomeStack
