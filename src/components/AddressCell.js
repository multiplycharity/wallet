import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackground
} from 'react-native'
import Colors from '../constants/colors'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'

import useScreenDimensions from '../hooks/useScreenDimensions'
import { isEthereumAddress } from '../helpers'

import { Feather } from '@expo/vector-icons'

const Cell = props => {
  const navigation = useNavigation()
  const screen = useScreenDimensions()

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          height: 80,
          width: screen.width,
          justifyContent: 'space-between',
          paddingVertical: 20
        },
        props.style
      ]}
      onPress={() => {} /*navigation.navigate('', { ...props })*/}
    >
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            marginLeft: 25,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: Colors.Gray200,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Feather
            name='credit-card'
            size={21}
            color={Colors.Gray500}
          ></Feather>
        </View>
        <View style={{ marginLeft: 20, justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '500' }}>
            {`${props.address.slice(0, 8)}...${props.address.slice(-7)}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default Cell
