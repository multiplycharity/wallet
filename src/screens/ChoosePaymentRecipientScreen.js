import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { View, Text, SafeAreaView, Clipboard, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SearchBar from '../components/SearchBar'
import Colors from '../constants/colors'
import { firestore } from '../config/firebase'
import Cell from '../components/Cell'
import { isEthereumAddress, isEmailAddress } from '../helpers'
import { Feather } from '@expo/vector-icons'

import * as Animatable from 'react-native-animatable'
import animationDefinitions from '../constants/animations'

const ChoosePaymentRecipientScreen = props => {
  const { amount } = props.route.params

  const [queryStr, setQueryStr] = useState('')
  const [foundUsers, setFoundUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExistingUserEmail, setIsExistingUserEmail] = useState(false)

  const navigation = useNavigation()

  //   useLayoutEffect(() => {
  //     navigation.setOptions({
  //       headerTitle: `$${amount}`,
  //     //   headerTitleStyle: { fontSize: screen.height > 800 ? 21 : 18 }
  //     })
  //   }, [navigation])

  //   {isEthereumAddress(queryStr) || foundUsers.length > 0 ? (
  //     <Text style={styles.sectionHeader}>Suggested</Text>
  //   ) : null}

  useEffect(() => {
    setIsLoading(true)
    setIsExistingUserEmail(false)
    setFoundUsers([])
    ;(async () => {
      const users = await search(queryStr)
      users.map(user => {
        if (user.email === queryStr) setIsExistingUserEmail(true)
      })
      setFoundUsers(users)
      setIsLoading(false)
    })()
  }, [queryStr])

  const search = async queryStr => {
    let docs = []

    if (queryStr) {
      const emails = await firestore
        .collection('users')
        .where('email', '>=', queryStr)
        .where('email', '<=', queryStr + '\uf8ff')
        .get()

      emails.docs.forEach(doc => {
        docs.push(doc.data())
      })

      if (isEthereumAddress(queryStr)) {
        const addresses = await firestore
          .collection('users')
          .where('address', '>=', queryStr)
          .where('address', '<=', queryStr + '\uf8ff')
          .get()

        addresses.docs.forEach(doc => {
          docs.push(doc.data())
        })
      }
    }

    return docs
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White }}>
      <SearchBar
        leftTitle='To'
        placeholder='Email, address'
        value={queryStr}
        onChangeText={text => setQueryStr(text)}
        rightButtonTitle={queryStr ? 'Clear' : 'Paste'}
        onHandleRightButton={
          queryStr
            ? () => {
                setQueryStr('')
              }
            : async () => {
                const textFromClipboard = await Clipboard.getString()
                setQueryStr(textFromClipboard.trim())
              }
        }
      ></SearchBar>
      {isEmailAddress(queryStr) && false ? (
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.Gray100,
            height: 80
          }}
        >
          <Text
            style={{
              marginLeft: 5,
              fontSize: 18,
              fontWeight: '500',
              color: Colors.Blue
            }}
          >
            Send By Link
          </Text>
        </View>
      ) : null}

      {!isLoading ? (
        isEthereumAddress(queryStr) && foundUsers.length === 0 ? (
          <Cell
            title={`${queryStr.slice(0, 8)}...${queryStr.slice(-7)}`}
            iconName='credit-card'
          ></Cell>
        ) : foundUsers.length > 0 ? (
          foundUsers.map(user => (
            <Cell
              title={user?.name}
              subtitle={user?.email}
              imageUrl={user?.photoUrl}
              onPress={() => {
                navigation.navigate('ConfirmPayment', { ...user, amount })
              }}
            ></Cell>
          ))
        ) : null
      ) : null}

      {isEmailAddress(queryStr) && !isExistingUserEmail ? (
        <Cell title={queryStr} iconName='mail'></Cell>
      ) : null}

      {!isLoading &&
      queryStr &&
      foundUsers.length === 0 &&
      !isEthereumAddress(queryStr) &&
      !isEmailAddress(queryStr) ? (
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
            Try searching for another email or address
          </Text>
        </Animatable.View>
      ) : null}
    </SafeAreaView>
  )
}

export default ChoosePaymentRecipientScreen

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
