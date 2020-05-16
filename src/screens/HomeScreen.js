import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity
} from 'react-native'

import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { toggleSearchBar } from '../redux/screenReducer'

import { Feather } from '@expo/vector-icons'

import Colors from '../constants/colors'
import Button from '../components/Button'
import TransactionsList from '../components/TransactionsList'
import SearchBar from '../components/SearchBar'

import WalletSDK from '../helpers/WalletSDK'

const SDK = new WalletSDK()

const ListHeader = props => {
  const navigation = useNavigation()
  const [balance, setBalance] = useState('0')

  const address = useSelector(state => state.user?.wallet?.address)

  useEffect(() => {
    address &&
      SDK.getBalance(address).then(balance => setBalance(balance.toString()))
  }, [address])

  return (
    <View style={[styles.container, { marginBottom: 40 }]}>
      <Text style={styles.balance}>${balance}</Text>
      <Text style={styles.balanceDescription}>Cash Balance</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 50
        }}
      >
        <Button
          title='Add Cash'
          style={{}}
          width={180}
          onPress={() => {
            navigation.navigate('ScannerModal')
          }}
        ></Button>
        <Button
          title='Cash Out'
          width={180}
          style={{ marginLeft: 16 }}
          onPress={() => {
            navigation.navigate('QRScanner')
          }}
        ></Button>
      </View>
    </View>
  )
}

const HomeScreen = props => {
  const { navigation, route } = props

  const parentNavigation = navigation.dangerouslyGetParent()

  const isSearchBarActive = useSelector(
    state => state.screen.homeScreen.isSearchBarActive
  )

  if (isSearchBarActive && parentNavigation) {
    parentNavigation.setOptions({ headerShown: false })
  } else {
    parentNavigation.setOptions({ headerShown: true })
  }

  const dispatch = useDispatch()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />

      {isSearchBarActive ? (
        <SearchBar
          title='Search email, address'
          onClose={() => {
            dispatch(toggleSearchBar())
          }}
        ></SearchBar>
      ) : null}

      <TransactionsList
        ListHeaderComponent={!isSearchBarActive ? ListHeader : null}
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
