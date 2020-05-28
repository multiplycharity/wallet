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

  const CellImage = () => {
    const imgUrl = props.user?.photoUrl
    // `https://randomuser.me/api/portraits/med/men/${1}.jpg`

    return (
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
        {imgUrl ? (
          <ImageBackground
            style={{
              flex: 1,
              borderRadius: 20,
              width: '100%',
              height: '100%',
              overflow: 'hidden'
            }}
            source={{
              uri: imgUrl
            }}
          />
        ) : (
          <Feather name='user' size={21} color={Colors.Gray500}></Feather>
        )}
      </View>
    )
  }

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
        <CellImage imageUrl={props.imageUrl}></CellImage>
        <View style={{ marginLeft: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '500' }}>
            {props.user.name}
          </Text>

          <Text
            style={{
              marginTop: 6,
              fontSize: 14,
              fontWeight: '400',
              color: Colors.Gray500
            }}
          >
            {props.user.email}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default Cell
