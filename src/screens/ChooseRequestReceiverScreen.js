import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  Clipboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  Share
} from 'react-native'
import { useNavigation, CommonActions } from '@react-navigation/native'
import SearchBar from '../components/SearchBar'
import Colors from '../constants/colors'
import { firestore } from '../config/firebase'
import Cell from '../components/Cell'
import {
  isEthereumAddress,
  isEmailAddress,
  searchUser,
  getUserByEmail,
  sendPushNotification
} from '../helpers'
import { Feather } from '@expo/vector-icons'

import * as Animatable from 'react-native-animatable'
import animationDefinitions from '../constants/animations'
import { useSelector } from 'react-redux'

const ChoosePaymentReceiverScreen = props => {
  const { amount } = props.route.params
  const [queryStr, setQueryStr] = useState('')
  const [foundUsers, setFoundUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExistingUserEmail, setIsExistingUserEmail] = useState(false)

  const myself = useSelector(state => state.user)

  const onRequest = async email => {
    try {
      const requestReceiver = await getUserByEmail(email)

      let response = await sendPushNotification({
        to: requestReceiver.pushToken,
        title: 'Payment request',
        body: `${myself.name} has requested $${amount}`,
        data: {
          amount: amount
        }
      })

      response = await response.json()
      Keyboard.dismiss()

      navigation.navigate('OverlayMessage', {
        message: `You requested $${amount} ${'\n'} from ${
          requestReceiver.name
        }`,
        type: response.data.status === 'ok' ? 'success' : 'error'
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  const navigation = useNavigation()

  useEffect(() => {
    setIsLoading(true)
    setIsExistingUserEmail(false)
    setFoundUsers([])
    ;(async () => {
      let users = await searchUser(queryStr)

      users = users.filter(user => user.email !== myself.email)

      users.map(user => {
        if (user.email === queryStr) setIsExistingUserEmail(true)
      })
      setFoundUsers(users)
      setIsLoading(false)
    })()
  }, [queryStr])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White }}>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          alignItems: 'center',
          height: 80,
          flexDirection: 'row',
          borderColor: Colors.Gray200
        }}
        onPress={() => {
          setIsTextInputFocused(true)
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: Colors.Black,
            marginLeft: 30
          }}
        >
          From
        </Text>

        <TextInput
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 10,
            paddingRight: 65,
            marginHorizontal: 20,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 18,
            fontWeight: '400'
          }}
          placeholder='Email'
          autoFocus={true}
          autoCorrect={false}
          autoCapitalize='none'
          clearTextOnFocus={true}
          value={queryStr}
          onChangeText={text => setQueryStr(text)}
        ></TextInput>

        <TouchableOpacity
          style={{ marginRight: 30 }}
          onPress={
            queryStr
              ? () => {
                  setQueryStr('')
                }
              : async () => {
                  const textFromClipboard = await Clipboard.getString()
                  setQueryStr(textFromClipboard.trim())
                }
          }
        >
          <Text
            style={{
              fontSize: 16,
              color: Colors.Gray600,
              fontWeight: '500'
            }}
          >
            {queryStr ? 'Clear' : 'Paste'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {foundUsers.length > 0 &&
        foundUsers.map(user => (
          <Cell
            title={user?.name}
            subtitle={user?.email}
            imageUrl={user?.photoUrl}
            onPress={async () => onRequest(user?.email)}
            key={user?.email}
          ></Cell>
        ))}

      {!isLoading && queryStr && foundUsers.length === 0 ? (
        <Animatable.View
          animation='fadeIn'
          iterationCount={1}
          direction='alternate'
          duration={240}
          delay={240}
          style={{
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20
          }}
        >
          <Text
            style={{ fontWeight: '600', fontSize: 18, textAlign: 'center' }}
          >
            No results
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: 16,
              color: Colors.Gray600,
              textAlign: 'center'
            }}
          >
            Try searching for another email
          </Text>
        </Animatable.View>
      ) : null}
    </SafeAreaView>
  )
}

export default ChoosePaymentReceiverScreen

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: Colors.Gray100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: Colors.Gray500,
    fontWeight: '600',
    textTransform: 'uppercase'
  }
})
