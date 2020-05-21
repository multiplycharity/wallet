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

const PaymentScreen = ({ navigation }) => {
  const displayValue = useSelector(state => state.paymentKeyboard.displayValue)

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
          <View
            style={{
              height: 180,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',

              marginBottom: 80
            }}
          >
            <Text
              style={{
                fontSize:
                  displayValue.length <= 4
                    ? 88
                    : displayValue.length <= 6
                    ? 72
                    : 64,
                fontWeight: '500',
                paddingHorizontal: 25
              }}
            >
              ${displayValue}
            </Text>
          </View>

          <PaymentKeyboard style={{}}></PaymentKeyboard>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 40
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
          </View>
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
