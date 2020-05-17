import React, { useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Colors from '../constants/colors'

const PaymentScreen = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content')
    }, [])
  )

  return (
    <>
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
