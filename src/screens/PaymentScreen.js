import React, { useLayoutEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native'
import Colors from '../constants/colors'

const PaymentScreen = ({ navigation }) => {
  return (
    <>
      <StatusBar barStyle='light-content'></StatusBar>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.Blue }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>
            Payment Screen
          </Text>
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
    backgroundColor: Colors.Blue
  }
})
