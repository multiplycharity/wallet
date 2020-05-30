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
  ScrollView,
  Keyboard,
  Share
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SearchBar from '../components/SearchBar'
import Colors from '../constants/colors'
import { firestore } from '../config/firebase'
import Cell from '../components/Cell'
import { isEthereumAddress, isEmailAddress } from '../helpers'
import { Feather } from '@expo/vector-icons'
import { CommonActions } from '@react-navigation/native'

import * as Animatable from 'react-native-animatable'
import animationDefinitions from '../constants/animations'

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const ChoosePaymentRecipientScreen = props => {
  const { amount } = props.route.params

  const [queryStr, setQueryStr] = useState('')
  const [foundUsers, setFoundUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExistingUserEmail, setIsExistingUserEmail] = useState(false)
  const [isTextInputFocused, setIsTextInputFocused] = useState(false)
  const [paymentType, setPaymentType] = useState(null)

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

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Message'
      })

      if (result.action !== Share.dismissedAction) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'Payment'
              }
            ]
          })
        )
      }
    } catch (error) {
      throw error
    }
  }

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
    <DismissKeyboard>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White }}>
        <View>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              alignItems: 'center',
              height: 80,
              flexDirection: 'row',
              borderColor: Colors.Gray200,
              borderTopWidth: StyleSheet.hairlineWidth
            }}
            onPress={() => {
              setIsTextInputFocused(true)
            }}
          >
            {!isTextInputFocused && (
              <Text style={{ marginLeft: 30, fontSize: 18, fontWeight: '600' }}>
                Send to existing user or address
              </Text>
            )}
            {isTextInputFocused && (
              <>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: Colors.Black,
                    marginLeft: 30
                  }}
                >
                  To
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
                  placeholder='Email, address'
                  onFocus={() => {
                    setIsTextInputFocused(true)
                  }}
                  onBlur={() => {
                    setIsTextInputFocused(false)
                  }}
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
              </>
            )}
          </TouchableOpacity>

          {!isTextInputFocused && (
            <TouchableOpacity
              style={{
                alignItems: 'center',
                height: 80,
                flexDirection: 'row',
                borderColor: Colors.Gray200,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderBottomWidth: StyleSheet.hairlineWidth
              }}
              onPress={onShare}
            >
              <Text style={{ marginLeft: 30, fontSize: 18, fontWeight: '600' }}>
                Send to anyone by link
              </Text>
            </TouchableOpacity>
          )}

          {!isLoading ? (
            isEthereumAddress(queryStr) && foundUsers.length === 0 ? (
              <Cell
                title={`${queryStr.slice(0, 8)}...${queryStr.slice(-7)}`}
                iconName='credit-card'
                onPress={() => {
                  navigation.navigate('ConfirmPayment', {
                    title: `${queryStr.slice(0, 8)}...${queryStr.slice(-7)}`,
                    iconName: 'credit-card',
                    amount,
                    address: queryStr
                  })
                }}
              ></Cell>
            ) : foundUsers.length > 0 ? (
              foundUsers.map(user => (
                <Cell
                  title={user?.name}
                  subtitle={user?.email}
                  imageUrl={user?.photoUrl}
                  onPress={() => {
                    navigation.navigate('ConfirmPayment', {
                      title: user.name,
                      subtitle: user.email,
                      imageUrl: user.photoUrl,
                      amount,
                      address: user.address
                    })
                  }}
                  key={user?.email}
                ></Cell>
              ))
            ) : null
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
        </View>
      </SafeAreaView>
    </DismissKeyboard>
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
