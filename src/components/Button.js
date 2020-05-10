import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import Colors from '../constants/colors'
import * as Haptics from 'expo-haptics'

const Button = props => {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: props.backgroundColor || Colors.Gray200,
          borderRadius: props.width / 2 || 90,
          height: props.height || 50,
          width: props.width || 180,
          justifyContent: 'center',
          alignItems: 'center'
        },
        props.style
      ]}
      onPress={() => {
        Haptics.notificationAsync('success')
        // Haptics.impactAsync('heavy')
        if (typeof props.onPress === 'function') props.onPress()
      }}
    >
      <Text
        style={[
          {
            fontSize: 18,
            fontWeight: '500',
            color: props.color || Colors.Black
          }
        ]}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})

export default Button
