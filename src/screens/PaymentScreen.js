import React, { useEffect, useState, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native'
import Colors from '../constants/colors'

import { Dimensions } from 'react-native'

import { useSelector, useDispatch } from 'react-redux'
import PaymentKeyboard from '../components/PaymentKeyboard'
import Button from '../components/Button'
import SpringButton from '../components/SpringButton'

import * as Haptics from 'expo-haptics'

import * as Animatable from 'react-native-animatable'

Animatable.initializeRegistryWithDefinitions({
  fadeInDown: {
    from: {
      opacity: 0.1,
      translateY: -40,
      scale: 0.6
    },
    to: {
      opacity: 1,
      translateY: 0,
      scale: 1
    },
    easing: 'ease-in'
  },
  moveLeft: {
    from: { translateX: 0 },
    to: { translateX: -10 }
  }
})

const PaymentScreen = ({ navigation }) => {
  const displayValue = useSelector(state => state.paymentKeyboard.displayValue)
  const [lastChar, setLastChar] = useState('')
  const lastCharRef = useRef('')

  const displayValueAnimation = useRef(null)
  const lastCharAnimation = useRef(null)
  let prevRef

  useEffect(() => {
    setLastChar(displayValue.slice(-1))
    lastCharRef.current = displayValue.slice(-1)
    prevRef = lastCharRef.current
    console.log('prevRef: ', prevRef)

    console.log('State', lastChar)
    console.log('Ref', lastCharRef.current)

    if (lastCharAnimation && displayValueAnimation && displayValue !== '0') {
      lastCharAnimation.current.fadeInDown(160)
      displayValueAnimation.current.moveLeft(300)
    }
  }, [displayValue])

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Animatable.View
            ref={displayValueAnimation}
            style={{
              height: 180,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              marginBottom: 60,
              flexDirection: 'row'
            }}
          >
            <Animatable.Text
              style={{
                fontSize:
                  displayValue.length <= 4
                    ? 88
                    : displayValue.length <= 6
                    ? 72
                    : 64,
                fontWeight: '500',
                paddingLeft: 25
              }}
            >
              ${displayValue.slice(0, -1)}
            </Animatable.Text>
            <Animatable.Text
              ref={lastCharAnimation}
              style={{
                fontSize:
                  displayValue.length <= 4
                    ? 88
                    : displayValue.length <= 6
                    ? 72
                    : 64,
                fontWeight: '500',
                paddingRight: 25
              }}
            >
              {lastChar}
            </Animatable.Text>
          </Animatable.View>

          <PaymentKeyboard style={{}}></PaymentKeyboard>

          <Animatable.View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 30
            }}
          >
            <Button
              title='Request'
              style={{}}
              width={180}
              onPress={() => {
                navigation.navigate('ScannerModal')
              }}
            ></Button>
            <Button
              title='Pay'
              width={180}
              style={{ marginLeft: 16 }}
              onPress={() => {
                navigation.navigate('QRScanner')
              }}
            ></Button>
          </Animatable.View>
        </View>
      </SafeAreaView>
    </>
  )
}

export default PaymentScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue'
  }
})
