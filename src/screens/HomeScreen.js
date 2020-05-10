import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native'
import Colors from '../constants/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Button from '../components/Button'

import useScreenDDimensions from '../hooks/useScreenDimensions'

const ActivityCell = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: Colors.Gray200
      }}
    >
      <Text>Pedro Gomes</Text>
    </View>
  )
}

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <Text style={styles.balance}>$5,755.04</Text>
      <Text style={styles.balanceDescription}>Cash Balance</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 74
        }}
      >
        <Button title='Add Cash' style={{}}></Button>
        <Button title='Cash Out' style={{ marginLeft: 14 }}></Button>
      </View>
      <View style={{ marginTop: 50 }}>
        <ActivityCell />
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.White
  },
  balance: {
    marginTop: 144,
    fontSize: 48,
    fontWeight: '500'
  },
  balanceDescription: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.Gray500
  }
})
