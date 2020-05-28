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
import { setIsScannerActive } from '../redux/screenReducer'

import PaymentKeyboard from '../components/PaymentKeyboard'
import Button from '../components/Button'
import SpringButton from '../components/SpringButton'

import * as Haptics from 'expo-haptics'
import * as Animatable from 'react-native-animatable'
import animationDefinitions from '../constants/animations'
const screen = Dimensions.get('screen')

Animatable.initializeRegistryWithDefinitions(animationDefinitions)

const PaymentScreen = ({ navigation }) => {
  const dispatch = useDispatch()

  const displayValue = useSelector(state => state.paymentKeyboard.displayValue)
  const [lastChar, setLastChar] = useState('')
  const lastCharRef = useRef('')

  const displayValueAnimation = useRef(null)
  const lastCharAnimation = useRef(null)
  let prevRef

  useEffect(() => {
    setLastChar(displayValue.slice(-1))
    lastCharRef.current = displayValue.slice(-1)

    if (lastCharAnimation && displayValueAnimation && displayValue !== '0') {
      lastCharAnimation.current.fadeInDown(120)
    }
  }, [displayValue])

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Animatable.View
            ref={displayValueAnimation}
            style={{
              height: screen.height / 5,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              flexDirection: 'row'
            }}
          >
            <Animatable.Text
              style={{
                fontSize:
                  displayValue.length <= 4
                    ? 80
                    : displayValue.length <= 6
                    ? 64
                    : 56,
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
                    ? 80
                    : displayValue.length <= 6
                    ? 64
                    : 56,
                fontWeight: '500',
                paddingRight: 25
              }}
            >
              {lastChar}
            </Animatable.Text>
          </Animatable.View>

          <PaymentKeyboard
            style={{ marginTop: screen.height > 800 ? 40 : 0 }}
          ></PaymentKeyboard>

          <Animatable.View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 40
            }}
          >
            <Button
              title='Request'
              style={{}}
              width={screen.width / 2.3}
              onPress={() => {
                // dispatch(setIsScannerActive(false))
                // navigation.navigate('')

                if (displayValue === '0') {
                  displayValueAnimation.current.shake(480)
                }
              }}
            ></Button>
            <Button
              title='Pay'
              width={screen.width / 2.3}
              style={{ marginLeft: 16 }}
              onPress={() => {
                if (displayValue === '0') {
                  displayValueAnimation.current.shake(480)
                } else {
                  navigation.navigate('ChoosePaymentRecipient', {
                    amount: displayValue
                  })
                }
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
