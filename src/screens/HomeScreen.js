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
import { toggleSearchBar } from '../redux/reducer'

import Colors from '../constants/colors'
import Button from '../components/Button'
import TransactionsList from '../components/TransactionsList'
import SearchBar from '../components/SearchBar'

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
  const { navigation, route } = props

  const searchBarActive = useSelector(state => state.searchBarActive)

  if (searchBarActive) {
    navigation.setOptions({ headerShown: false })
  } else {
    navigation.setOptions({ headerShown: true })
  }

  const dispatch = useDispatch()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />

      {searchBarActive ? (
        <SearchBar
          title='Search email, address'
          onClose={() => {
            dispatch(toggleSearchBar())
          }}
        ></SearchBar>
      ) : null}

      <TransactionsList
        ListHeaderComponent={!searchBarActive ? ListHeader : null}
      ></TransactionsList>
    </SafeAreaView>
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
