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
import { Feather } from '@expo/vector-icons'

import { Dimensions } from 'react-native'

import { useSelector, useDispatch } from 'react-redux'
import {
  setIsScannerActive,
  RESET_PAYMENT_SCREEN
} from '../redux/screenReducer'

import Button from '../components/Button'
import SpringButton from '../components/SpringButton'

import * as Haptics from 'expo-haptics'
import * as Animatable from 'react-native-animatable'
import animationDefinitions from '../constants/animations'
const screen = Dimensions.get('screen')

Animatable.initializeRegistryWithDefinitions(animationDefinitions)

const Key = props => {
  const screen = Dimensions.get('screen')

  return (
    <SpringButton
      style={{
        backgroundColor: 'white',
        height: 70,
        width: screen.width / 3,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onPressIn={props.onPressIn}
      onPress={props.onPress}
      onPressOut={props.onPressOut}
    >
      {props.value === 'C' ? (
        <Feather name='chevron-left' size={24}></Feather>
      ) : (
        <Text style={{ fontSize: 21, fontWeight: '600' }}>{props.value}</Text>
      )}
    </SpringButton>
  )
}

const PaymentScreen = ({ navigation, route }) => {
  const scannedAddress = route.params?.scannedAddress

  const dispatch = useDispatch()

  const balance = useSelector(state => state.user.balance)

  const [displayValue, setDisplayValue] = useState('0')
  const [wholePart, setWholePart] = useState('0')
  const [decimalPart, setDecimalPart] = useState('')
  const [hasDecimalPart, setHasDecimalPart] = useState(false)

  const [lastChar, setLastChar] = useState('0')

  const lastPressedKeyRef = useRef(null)

  const displayValueAnimation = useRef(null)
  const lastCharAnimation = useRef(null)

  const [errorMessage, setErrorMessage] = useState('')
  const [errorTimer, setErrorTimer] = useState(null)
  const errorMessageAnimation = useRef(null)

  const lastAction = useSelector(state => state.lastAction)

  useEffect(() => {
    if (lastAction.type === RESET_PAYMENT_SCREEN) {
      setDisplayValue('0')
      setWholePart('0')
      setDecimalPart('0')
      setHasDecimalPart(false)
      setLastChar('0')
      setErrorMessage('')
      setErrorTimer(null)
      lastPressedKeyRef.current = null
    }
  }, [lastAction])

  const handleInput = key => {
    lastPressedKeyRef.current = key

    switch (key) {
      case '0':
        if (displayValue === '0' || displayValue === '0.0') {
          displayValueAnimation.current.shake(480)
          return
        }
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if (hasDecimalPart && decimalPart.length >= 2) {
          displayValueAnimation.current.shake(480)
          return
        }
        if (!hasDecimalPart && wholePart.length >= 5) {
          displayValueAnimation.current.shake(480)
          return
        }
        setLastChar(key)

        hasDecimalPart
          ? setDecimalPart(decimalPart + key)
          : setWholePart(wholePart === '0' ? key : wholePart + key)

        setDisplayValue(displayValue === '0' ? key : displayValue + key)

        !(lastPressedKeyRef.current === '0' && displayValue === '0') &&
          lastCharAnimation.current.fadeInAndScale(180)

        return

      case '.':
        // if (wholePart === '0') {
        //   displayValueAnimation.current.shake(480)
        //   return
        // }
        hasDecimalPart && displayValueAnimation.current.shake(480)

        setDisplayValue(!hasDecimalPart ? displayValue + key : displayValue)

        if (!hasDecimalPart) {
          setHasDecimalPart(true)
          setLastChar(key)
          lastCharAnimation.current.fadeInAndScale(180)
        }

        return

      case 'C':
        displayValue !== '0' && lastCharAnimation.current.fadeInAndScale(180)

        if (displayValue.length === 1) {
          displayValue === '0' && displayValueAnimation.current.shake(480)
          setDisplayValue('0')
          setWholePart('0')
          setLastChar('0')
          return
        } else {
          if (displayValue.slice(-1) === '.') {
            setHasDecimalPart(false)
            setDecimalPart('')
          }

          setDisplayValue(
            displayValue !== '0' ? displayValue.slice(0, -1) : displayValue
          )

          if (hasDecimalPart) {
            setDecimalPart(
              decimalPart !== '' ? decimalPart.slice(0, -1) : decimalPart
            )
          } else {
            setWholePart(wholePart !== '0' ? wholePart.slice(0, -1) : wholePart)
          }

          setLastChar(displayValue[displayValue.length - 2])
        }
    }
  }

  const PaymentKeyboard = props => {
    return (
      <View style={{}}>
        <View style={{ flexDirection: 'row' }}>
          <Key value={'1'} onPress={() => handleInput('1')}></Key>
          <Key value={'2'} onPress={() => handleInput('2')}></Key>
          <Key value={'3'} onPress={() => handleInput('3')}></Key>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Key value={'4'} onPress={() => handleInput('4')}></Key>
          <Key value={'5'} onPress={() => handleInput('5')}></Key>
          <Key value={'6'} onPress={() => handleInput('6')}></Key>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Key value={'7'} onPress={() => handleInput('7')}></Key>
          <Key value={'8'} onPress={() => handleInput('8')}></Key>
          <Key value={'9'} onPress={() => handleInput('9')}></Key>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Key value={'.'} onPress={() => handleInput('.')}></Key>
          <Key value={'0'} onPress={() => handleInput('0')}></Key>
          <Key value={'C'} onPress={() => handleInput('C')}></Key>
        </View>
      </View>
    )
  }

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
          <View
            style={{
              paddingHorizontal: 16,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              width: '100%',
              height: 80
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: Colors.Black
              }}
            >
              Send to{' '}
              {`${scannedAddress.slice(0, 10)}...${scannedAddress.slice(-8)}`}
            </Text>
          </View>

          <Animatable.View
            ref={displayValueAnimation}
            style={{
              height: screen.height / 8,
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

          <Animatable.View
            ref={errorMessageAnimation}
            style={{
              height: 16,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: 'red' }}>{errorMessage}</Text>
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
              title='Send'
              width={screen.width / 1.1}
              style={{ marginHorizontal: 16 }}
              onPress={() => {
                if (
                  displayValue === '0' ||
                  displayValue === '0.0' ||
                  displayValue === '0.'
                ) {
                  displayValueAnimation.current.shake(480)
                  return
                } else if (parseFloat(balance) < parseFloat(displayValue)) {
                  errorTimer && clearTimeout(errorTimer)
                  setErrorMessage('Insufficient funds')
                  errorMessageAnimation.current.fadeIn(480)

                  setErrorTimer(
                    setTimeout(() => {
                      errorMessageAnimation.current.fadeOut(480).then(() => {
                        setErrorMessage('')
                      })
                    }, 1800)
                  )

                  displayValueAnimation.current.shake(480)
                } else {
                  navigation.navigate('ConfirmPayment', {
                    amount:
                      decimalPart === '00'
                        ? displayValue.slice(0, -3)
                        : decimalPart === '0'
                        ? displayValue.slice(0, -2)
                        : displayValue,
                    title: `${scannedAddress.slice(
                      0,
                      8
                    )}...${scannedAddress.slice(-7)}`,
                    iconName: 'credit-card',
                    address: scannedAddress
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
