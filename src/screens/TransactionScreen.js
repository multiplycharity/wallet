import React, { useLayoutEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Button,
  Dimensions,
  ImageBackground,
  Clipboard,
  TouchableOpacity
} from 'react-native'
import * as WebBrowser from 'expo-web-browser'

const screen = Dimensions.get('screen')

import Colors from '../constants/colors'
import { useNavigation } from '@react-navigation/native'
import { isEthereumAddress } from '../helpers'
import moment from 'moment'
import { BLOCK_EXPLORER_HOST } from 'react-native-dotenv'
import { Feather } from '@expo/vector-icons'

const TransactionScreen = props => {
  const [tooltipVisible, setTooltipVisible] = useState(false)

  const navigation = useNavigation()
  const route = props.route

  const { amount, timestamp, type, title, user, id: txHash } = route.params

  let imgUrl = user?.photoUrl

  React.useLayoutEffect(() => {
    navigation.setOptions({
      tabBarVisible: false
    })
  }, [navigation])

  return (
    <View style={styles.container}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: type === 'out' ? Colors.Red75 : Colors.Green75,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 40
        }}
      >
        {imgUrl ? (
          <ImageBackground
            style={{
              flex: 1,
              borderRadius: 40,
              width: '100%',
              height: '100%',
              overflow: 'hidden'
            }}
            source={{
              uri: imgUrl
            }}
          />
        ) : (
          <Feather
            name={type === 'out' ? 'arrow-up' : 'arrow-down'}
            size={42}
            color='white'
          ></Feather>
        )}
      </View>
      <Text style={{ marginTop: 20, fontSize: 21, fontWeight: '500' }}>
        {type === 'in' ? 'Incoming Transaction' : 'Outgoing Transaction'}
      </Text>

      <Text
        style={{
          marginTop: 5,
          fontSize: 16,
          fontWeight: '400',
          color: Colors.Gray500
        }}
      >
        {type === 'in' ? 'from' : 'to'}{' '}
        {isEthereumAddress(title)
          ? `${title.slice(0, 8)}...${title.slice(-7)}`
          : user?.email
          ? user.email
          : title}
      </Text>

      <Text
        style={{
          marginTop: screen.height > 800 ? 120 : 90,
          fontSize: 60,
          fontWeight: '400'
        }}
      >
        {type === 'out' ? '-$' : '$'}
        {amount}
      </Text>
      <Text
        style={{
          marginTop: 5,
          fontSize: 16,
          fontWeight: '400',
          color: Colors.Gray500
        }}
      >
        {moment.unix(timestamp).calendar(null, { sameElse: 'MM DD YYYY' })}
      </Text>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          marginBottom: 64
        }}
      >
        <TouchableOpacity
          onPress={async () => {
            await WebBrowser.openBrowserAsync(
              `${BLOCK_EXPLORER_HOST}/tx/0x${txHash}`
            )
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              color: Colors.Blue
            }}
          >
            More Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default TransactionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.White
  },
  avatar: { marginTop: 40, width: 80, height: 80, borderRadius: 40 }
})
