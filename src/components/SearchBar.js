import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { Feather } from '@expo/vector-icons'

import useScreenDimensions from '../hooks/useScreenDimensions'
import Colors from '../constants/colors'

const SearchBar = props => {
  const screen = useScreenDimensions()

  const [queryString, setQueryString] = useState('')

  //   <Text
  //   style={{
  //     fontSize: 18,
  //     color: Colors.Gray500,
  //     fontWeight: '400',
  //     marginLeft: 10
  //   }}
  // ></Text>

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
          marginHorizontal: 14,
          backgroundColor: Colors.Gray100,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 18,
          fontWeight: '400'
        }}
        placeholderTextColor={Colors.Gray500}
        placeholder={props.title}
        value={queryString}
        onChangeText={text => setQueryString(text)}
        autoCorrect={false}
        autoFocus={true}
      ></TextInput>

      <View style={{ position: 'absolute', left: 0, marginLeft: 29 }}>
        <Feather name='search' size='20' color={Colors.Gray500}></Feather>
      </View>

      <TouchableOpacity style={{ marginRight: 20 }} onPress={props.onClose}>
        <Text style={{ fontSize: 16 }}>Close</Text>
      </TouchableOpacity>
    </View>
  )
}
export default SearchBar
