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

const PaymentScreen = ({ navigation }) => {
  const displayValue = useSelector(state => state.paymentKeyboard.displayValue)

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View style={{ height: 160 }}>
            <Text
              style={{
                fontSize:
                  displayValue.length <= 4
                    ? 88
                    : displayValue.length <= 6
                    ? 72
                    : 64,
                fontWeight: '700',
                paddingHorizontal: 25,
                marginBottom: 40
              }}
            >
              ${displayValue}
            </Text>
          </View>
          <PaymentKeyboard></PaymentKeyboard>
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
