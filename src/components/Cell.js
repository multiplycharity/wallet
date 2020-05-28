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

import { Feather } from '@expo/vector-icons'

const Cell = props => {
  const navigation = useNavigation()
  const screen = useScreenDimensions()

  const CellImage = () => {
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
        {props.imageUrl ? (
          <ImageBackground
            style={{
              flex: 1,
              borderRadius: 20,
              width: '100%',
              height: '100%',
              overflow: 'hidden'
            }}
            source={{
              uri: props.imageUrl
            }}
          />
        ) : (
          <Feather
            name={props.iconName}
            size={21}
            color={Colors.Gray500}
          ></Feather>
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
      {...props}
    >
      <View style={{ flexDirection: 'row' }}>
        <CellImage imageUrl={props.imageUrl}></CellImage>
        <View style={{ marginLeft: 20, justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '500' }}>{props.title}</Text>

          {props.subtitle ? (
            <Text
              style={{
                marginTop: 6,
                fontSize: 14,
                fontWeight: '400',
                color: Colors.Gray500
              }}
            >
              {props.subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default Cell
