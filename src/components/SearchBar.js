import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { Feather } from '@expo/vector-icons'

import useScreenDimensions from '../hooks/useScreenDimensions'
import Colors from '../constants/colors'

const SearchBar = props => {
  const screen = useScreenDimensions()

  return (
    <View
      style={{
        alignItems: 'center',
        height: 60,
        width: screen.width,
        flexDirection: 'row'
      }}
    >
      <TextInput
        style={{
          flex: 1,
          flexDirection: 'row',
          paddingVertical: 10,
          paddingLeft: 45,
          paddingRight: 80,
          marginHorizontal: 16,
          backgroundColor: Colors.Gray100,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 18,
          fontWeight: '400'
        }}
        placeholderTextColor={Colors.Gray500}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={text => props.onChangeText(text)}
        autoCorrect={false}
        autoFocus={true}
        autoCapitalize='none'
      ></TextInput>

      <View style={{ position: 'absolute', left: 0, marginLeft: 30 }}>
        {props.leftTitle ? (
          <Text
            style={{ fontSize: 18, fontWeight: '600', color: Colors.Black }}
          >
            {props.leftTitle}
          </Text>
        ) : (
          <Feather name='search' size={20} color={Colors.Gray500}></Feather>
        )}
      </View>

      <TouchableOpacity
        style={{
          marginRight: 20,
          position: 'absolute',
          right: 0,
          marginRight: 30
        }}
        onPress={props.onHandleRightButton}
      >
        <Text
          style={{ fontSize: 16, color: Colors.Gray600, fontWeight: '500' }}
        >
          {props.rightButtonTitle}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
export default SearchBar
