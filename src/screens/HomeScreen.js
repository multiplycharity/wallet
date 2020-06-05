import React, { useState, useEffect, useLayoutEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native'

import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'

import Constants from 'expo-constants'

import { useSelector, useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { toggleSearchBar } from '../redux/screenReducer'

import { fetchTxs } from '../redux/transactions'
import { fetchBalance, updateUser } from '../redux/userReducer'
import { generateLink } from '../redux/linkdropReducer'

import { Feather } from '@expo/vector-icons'

import Colors from '../constants/colors'
import Button from '../components/Button'
import TransactionsList from '../components/TransactionsList'
import SearchBar from '../components/SearchBar'

const screen = Dimensions.get('screen')

const ListHeader = props => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const balance = useSelector(state => state.user?.balance)
  const address = useSelector(state => state.user?.wallet?.address)
  const privateKey = useSelector(state => state.user?.wallet?.privateKey)

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
          width={screen.width / 2.3}
          onPress={async () => {}}
        ></Button>
        <Button
          title='Cash Out'
          width={screen.width / 2.3}
          style={{ marginLeft: 16 }}
          onPress={() => {}}
        ></Button>
      </View>
    </View>
  )
}

const HomeScreen = props => {
  const dispatch = useDispatch()

  const { navigation, route } = props
  const [timer, setTimer] = useState(null)

  const lastAction = useSelector(state => state.lastAction)
  const email = useSelector(state => state.user.email)

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      )
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!')
        return
      }
      const pushToken = await Notifications.getExpoPushTokenAsync()

      dispatch(updateUser({ pushToken }))
    } else {
      // alert('Must use physical device for Push Notifications')
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250]
      })
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchData()

      setTimer(
        setInterval(() => {
          fetchData()
        }, 10000)
      )
      return () => {
        clearInterval(timer)
        setTimer(null)
      }
    }, [])
  )

  useEffect(() => {
    registerForPushNotificationsAsync()

    console.log('Subscribing to push notifications')
    const subscription = Notifications.addListener(notification => {
      if (notification.data?.type === 'PAYMENT_REQUEST') {
        navigation.navigate('Request', {
          amount: notification.data.amount,
          title: notification.data.title,
          subtitle: notification.data.subtitle,
          imageUrl: notification.data.imageUrl,
          address: notification.data.address,
          timestamp: notification.data.timestamp
        })
      }
    })

    return () => {
      console.log('Unsubscribing from push notifications')
      subscription.remove()
    }
  }, [])

  const fetchData = () => {
    dispatch(fetchTxs())
    dispatch(fetchBalance())
  }

  useEffect(() => {
    if (lastAction.type === 'RESET_APP') {
      clearInterval(timer)
    }
  }, [lastAction])

  const parentNavigation = navigation.dangerouslyGetParent()

  const isSearchBarActive = useSelector(
    state => state.screen.homeScreen.isSearchBarActive
  )

  if (isSearchBarActive && parentNavigation) {
    parentNavigation.setOptions({ headerShown: false })
  } else {
    parentNavigation.setOptions({ headerShown: true })
  }

  return (
    <SafeAreaView style={styles.container}>
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
