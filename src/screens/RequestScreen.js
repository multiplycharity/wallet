import React from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  ImageBackground,
  TouchableOpacity
} from 'react-native'
import Colors from '../constants/colors'
import Button from '../components/Button'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { useSafeArea, SafeAreaView } from 'react-native-safe-area-context'

const screen = Dimensions.get('screen')

const RequestScreen = props => {
  const {
    address,
    title,
    imageUrl,
    subtitle,
    amount,
    timestamp
  } = props.route.params

  const insets = useSafeArea()

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
        alignItems: 'center'
      }}
    >
      <Image
        style={{
          borderRadius: 40,
          width: 80,
          height: 80,
          overflow: 'hidden',
          marginTop: insets.top + 60
        }}
        source={{
          uri: imageUrl
        }}
      />

      <Text style={{ marginTop: 20, fontSize: 21, fontWeight: '500' }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 5,
          fontSize: 16,
          fontWeight: '400',
          color: Colors.Gray500
        }}
      >
        {subtitle}
      </Text>

      <Text
        style={{
          marginTop: screen.height > 800 ? 100 : 60,
          fontSize: 16,
          fontWeight: '400',
          color: Colors.Gray500
        }}
      >
        has requested
      </Text>

      <Text
        style={{
          marginTop: 5,
          fontSize: 60,
          fontWeight: '400'
        }}
      >
        ${amount}
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
          flexDirection: 'row',
          position: 'absolute',
          bottom: 40 + insets.bottom
        }}
      >
        <Button
          title='Cancel'
          width={screen.width / 2.3}
          onPress={() => props.navigation.goBack()}
        ></Button>
        <Button
          title='Accept'
          width={screen.width / 2.3}
          style={{ marginLeft: 16 }}
          onPress={() => {
            props.navigation.navigate('ConfirmPayment', {
              amount: amount,
              title: title,
              subtitle: subtitle,
              imageUrl: imageUrl,
              address: address,
              timestamp: timestamp
            })
          }}
        ></Button>
      </View>
    </SafeAreaView>
  )
}

export default RequestScreen
