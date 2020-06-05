import React, { useRef, useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import Colors from '../constants/colors'
import Button from '../components/Button'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'

import { useSafeArea, SafeAreaView } from 'react-native-safe-area-context'
import ConfettiCannon from 'react-native-confetti-cannon'
import { useFocusEffect } from '@react-navigation/core'
import { getUrlParams, getUserByAddress2, formatWei } from '../helpers'
import { claimLink, addLinkdropTxToFirebase } from '../redux/linkdropReducer'

import Spinner from 'react-native-loading-spinner-overlay'

const screen = Dimensions.get('screen')

const ClaimScreen = props => {
  const myself = useSelector(state => state.user)

  const dispatch = useDispatch()

  const confettiRef = useRef(null)
  const confettiFallDuration = 2500

  const [sender, setSender] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const {
    address,
    title,
    imageUrl,
    subtitle,
    amount,

    token,
    nft,
    feeToken,
    feeReceiver,
    nativeTokensAmount,
    tokensAmount,
    tokenId,
    feeAmount,
    expiration,
    data,
    linkKey,
    signerSignature,
    linkdropContract,
    sender: senderAddress,
    timestamp
  } = props.route.params

  useEffect(() => {
    ;(async () => {
      setSender(await getUserByAddress2(senderAddress))
      setIsLoading(false)
    })()
  }, [])

  const insets = useSafeArea()

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
      {isLoading ? (
        <Spinner visible={isLoading} />
      ) : (
        <>
          <Image
            style={{
              borderRadius: 40,
              width: 80,
              height: 80,
              overflow: 'hidden',
              marginTop: insets.top + 60
            }}
            source={{
              uri: sender.photoUrl
            }}
          />
          <Text style={{ marginTop: 20, fontSize: 21, fontWeight: '500' }}>
            {sender.name}
          </Text>
          <Text
            style={{
              marginTop: 5,
              fontSize: 16,
              fontWeight: '400',
              color: Colors.Gray500
            }}
          >
            {sender.email}
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
            ${formatWei(nativeTokensAmount)}
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
                const { success, txHash } = await dispatch(
                  claimLink({
                    token,
                    nft,
                    feeToken,
                    feeReceiver,
                    nativeTokensAmount,
                    tokensAmount,
                    tokenId,
                    feeAmount,
                    expiration,
                    data,
                    linkKey,
                    signerSignature,
                    linkdropContract,
                    sender: senderAddress,
                    timestamp
                  })
                )

                if (success && txHash) {
                  confettiRef.current.start()
                  setTimeout(
                    () => props.navigation.goBack(),
                    confettiFallDuration - 250
                  )
                } else props.navigation.goBack()
              }}
            ></Button>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

export default ClaimScreen
