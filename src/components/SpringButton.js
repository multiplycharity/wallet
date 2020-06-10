import React, { useState } from 'react'
import {
  Animated,
  Easing,
  TouchableHighlight,
  Text,
  View,
  TouchableWithoutFeedback
} from 'react-native'
import * as Haptics from 'expo-haptics'

const SpringButton = props => {
  const [scaleValue] = useState(new Animated.Value(0))
  const [childViewOpacity, setChildViewOpacity] = useState(1)

  const cardScale = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8]
  })

  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      onPressIn={() => {
        // setChildViewOpacity(0.5)

        // Haptics.impactAsync('light')

        scaleValue.setValue(0)
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 10,
          easing: Easing.ease,
          useNativeDriver: true
        }).start()

        if (typeof props.onPressIn === 'function') props.onPressIn()
      }}
      onPressOut={() => {
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 60,
          easing: Easing.ease,
          useNativeDriver: true
        }).start()

        if (typeof props.onPressOut === 'function') props.onPressOut()
      }}
    >
      <Animated.View
        style={{
          opacity: childViewOpacity,
          ...props.style,
          transform: [
            {
              scale: cardScale
            }
          ]
        }}
      >
        {props.children}
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

export default SpringButton
