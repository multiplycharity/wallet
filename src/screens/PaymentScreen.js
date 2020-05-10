import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Colors from '../constants/colors'

const PaymentScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Payment Screen</Text>
    </View>
  )
}

export default PaymentScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.White
  }
})
