import React, { useRef, useEffect, useState } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import Colors from '../constants/colors'
import * as Haptics from 'expo-haptics'

import * as Animatable from 'react-native-animatable'

Animatable.initializeRegistryWithDefinitions({
  zoomIn: {
    0: { scale: 1 },
    1: { scale: 1.1 }
  },
  zoomOut: {
    0: { scale: 1.1 },
    1: { scale: 1 }
  }
})

const Button = props => {
  const animationRef = useRef(null)

  return (
    <Animatable.View ref={animationRef} iterationCount={1}>
      <TouchableOpacity
        style={[
          {
            backgroundColor: props.backgroundColor || Colors.Gray200,
            borderRadius: props.width / 2 || 90,
            height: props.height || 50,
            width: props.width,
            justifyContent: 'center',
            alignItems: 'center'
          },
          props.style
        ]}
        onPressIn={() => {
          animationRef.current.zoomIn(60)
          if (typeof props.onPressIn === 'function') props.onPressIn()
        }}
        onPressOut={() => {
          animationRef.current.zoomOut(120)
          if (typeof props.onPressOut === 'function') props.onPressOut()
        }}
        onPress={() => {
          // Haptics.notificationAsync('success')
          Haptics.impactAsync('medium')
          if (typeof props.onPress === 'function') props.onPress()
        }}
      >
        <Text
          style={[
            {
              fontSize: 18,
              fontWeight: '500',
              paddingHorizontal: 20,
              color: props.color || Colors.Black
            }
          ]}
        >
          {props.title}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  )
}

export default Button
