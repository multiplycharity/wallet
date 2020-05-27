import React, { useState } from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SearchBar from '../components/SearchBar'
import Colors from '../constants/colors'

const ChoosePaymentRecipientScreen = props => {
  const { amount } = props.route.params

  const [queryStr, setQueryStr] = useState('')
  console.log('queryStr: ', queryStr)

  const navigation = useNavigation()

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: `$${amount}` })
  }, [navigation])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White }}>
      <SearchBar
        placeholder='Search email, address'
        value={queryStr}
        onChangeText={text => setQueryStr(text)}
      ></SearchBar>
    </SafeAreaView>
  )
}

export default ChoosePaymentRecipientScreen
