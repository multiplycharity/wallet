import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native'

import { useSelector, useDispatch } from 'react-redux'

import Colors from '../constants/colors'
import Button from '../components/Button'
import TransactionsList from '../components/TransactionsList'

const ListHeader = () => {
  return (
    <View style={[styles.container, { marginBottom: 40 }]}>
      <Text style={styles.balance}>$103.04</Text>
      <Text style={styles.balanceDescription}>Cash Balance</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 50
        }}
      >
        <Button title='Add Cash' style={{}}></Button>
        <Button title='Cash Out' style={{ marginLeft: 14 }}></Button>
      </View>
    </View>
  )
}

const HomeScreen = props => {
  const searchBarActive = useSelector(state => state.searchBarActive)

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <TransactionsList
        ListHeaderComponent={!searchBarActive ? ListHeader : null}
      ></TransactionsList>
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
    fontSize: 48,
    fontWeight: '500',
    marginTop: 40
  },
  balanceDescription: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.Gray500
  }
})
