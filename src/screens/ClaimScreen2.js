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
import {
  claimLink,
  addLinkdropTxToFirebase,
  isClaimedLink
} from '../redux/linkdropReducer'

import Spinner from 'react-native-loading-spinner-overlay'
import { ethers } from 'ethers'
import { Feather } from '@expo/vector-icons'

const screen = Dimensions.get('screen')

const ClaimScreen = props => {
  const myself = useSelector(state => state.user)

  const dispatch = useDispatch()

  const confettiRef = useRef(null)
  const confettiFallDuration = 2500

  const [isClaimed, setIsClaimed] = useState(false)

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
    sender
  } = props.route.params

  useEffect(() => {
    ;(async () => {
      const isClaimed = await dispatch(
        isClaimedLink({
          linkdropContract,
          linkId: new ethers.Wallet(linkKey).address
        })
      )

      setIsClaimed(isClaimed)
      setIsLoading(false)
    })()
  }, [])

  const insets = useSafeArea()

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
        alignItems: 'center',
        justifyContent: 'center'
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
        <Spinner
          visible={isLoading}
          overlayColor='rgba(255,255,255,0.25)'
          color={Colors.Gray500}
        />
      ) : (
        <>
          <View
            style={{
              alignItems: 'center',
              marginTop: 20
            }}
          >
            {!isClaimed && (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '400',
                  color: Colors.Gray500
                }}
              >
                You have received
              </Text>
            )}
            <Text
              style={{
                marginTop: 5,
                fontSize: 64,
                fontWeight: '400'
              }}
            >
              ${formatWei(nativeTokensAmount)}
            </Text>
            {isClaimed && (
              <Text
                style={{
                  marginTop: 5,
                  fontSize: 18,
                  fontWeight: '400',
                  color: Colors.Gray500
                }}
              >
                claimed
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              bottom: 40 + insets.bottom
            }}
          >
            <Button
              title={!isClaimed ? 'Claim' : 'Go to wallet'}
              width={screen.width / 1.2}
              onPress={async () => {
                if (!isClaimed) {
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
                      sender
                    })
                  )

                  if (success && txHash) {
                    confettiRef.current.start()
                    setTimeout(
                      () => props.navigation.goBack(),
                      confettiFallDuration
                    )
                  } else props.navigation.goBack()
                } else {
                  props.navigation.goBack()
                }
              }}
            ></Button>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

export default ClaimScreen
