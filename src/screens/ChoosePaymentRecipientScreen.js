import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Text, SafeAreaView, Clipboard } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SearchBar from '../components/SearchBar'
import Colors from '../constants/colors'
import { firestore } from '../config/firebase'
import UserCell from '../components/UserCell'
import { isEthereumAddress } from '../helpers'

const ChoosePaymentRecipientScreen = props => {
  const { amount } = props.route.params

  const [queryStr, setQueryStr] = useState('')
  const [foundUsers, setFoundUsers] = useState([])

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: `$${amount}` })
  }, [navigation])

  useEffect(() => {
    ;(async () => {
      const users = await search(queryStr)
      setFoundUsers(users)
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
        placeholder='Search email, address'
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

      {foundUsers.length > 0
        ? foundUsers.map(user => <UserCell user={user}></UserCell>)
        : null}
    </SafeAreaView>
  )
}

export default ChoosePaymentRecipientScreen
