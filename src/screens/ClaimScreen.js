import React, { useRef, useEffect, useCallback } from 'react'
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
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'

import { useSafeArea, SafeAreaView } from 'react-native-safe-area-context'
import ConfettiCannon from 'react-native-confetti-cannon'
import { useFocusEffect } from '@react-navigation/core'
import { getUrlParams } from '../helpers'
import { claimLink } from '../redux/linkdropReducer'

const screen = Dimensions.get('screen')

const RequestScreen = props => {
  const dispatch = useDispatch()

  const confettiRef = useRef(null)
  const confettiFallDuration = 2500

  const {
    address,
    title,
    imageUrl,
    subtitle,
    amount,
    timestamp,
    url
  } = props.route.params

  const insets = useSafeArea()

  //   useEffect(() => {
  //     ;(async () => {
  //       const claimParams = await getUrlParams(url)
  //       console.log('claimParams: ', claimParams)
  //     })()
  //   }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
        alignItems: 'center'
      }}
    >
      <ConfettiCannon
        ref={confettiRef}
        count={100}
        origin={{ x: -40, y: 0 }}
        fadeOut={true}
        autoStart={false}
        explosionSpeed={250}
        fallSpeed={confettiFallDuration}
      />
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
        has sent you
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
          title='Claim'
          width={screen.width / 1.2}
          onPress={async () => {
            //TODO dispatch claim function

            const claimParams = await getUrlParams(url)
            console.log('claimParams: ', claimParams)

            dispatch(claimLink(claimParams))

            confettiRef.current.start()

            // setTimeout(
            //   () => props.navigation.goBack(),
            //   confettiFallDuration - 250
            // )

            // props.navigation.navigate('ConfirmPayment', {
            //   amount: amount,
            //   title: title,
            //   subtitle: subtitle,
            //   imageUrl: imageUrl,
            //   address: address,
            //   timestamp: timestamp
            // })
          }}
        ></Button>
      </View>
    </SafeAreaView>
  )
}

export default RequestScreen
