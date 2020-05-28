import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SearchBar from '../components/SearchBar'
import Colors from '../constants/colors'
import { firestore } from '../config/firebase'
import UserCell from '../components/UserCell'

const ChoosePaymentRecipientScreen = props => {
  const { amount } = props.route.params

  const [query, setQuery] = useState('')
  console.log('query: ', query)
  const [foundUsers, setFoundUsers] = useState([])

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: `$${amount}` })
  }, [navigation])

  useEffect(() => {
    ;(async () => {
      const usrs = await search(query)
      setFoundUsers(usrs)
    })()
  }, [query])

  const search = async query => {
    let docs = []

    if (query) {
      const emails = await firestore
        .collection('users')
        .where('email', '>=', query)
        .where('email', '<=', query + '\uf8ff')
        .get()

      emails.docs.forEach(doc => {
        docs.push(doc.data())
      })
    }

    return docs
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White }}>
      <SearchBar
        placeholder='Search email, address'
        value={query}
        onChangeText={text => setQuery(text)}
      ></SearchBar>

      {foundUsers
        ? foundUsers.map(user => <UserCell user={user}></UserCell>)
        : null}
    </SafeAreaView>
  )
}

export default ChoosePaymentRecipientScreen
