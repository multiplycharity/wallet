import React, { useEffect, useState, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Share,
  LayoutAnimation,
  StatusBar
} from 'react-native'

import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

import Colors from '../constants/colors'
import { Feather } from '@expo/vector-icons'
import QRCode from 'react-native-qrcode-svg'
import { toggleScannerScreen } from '../redux/screenReducer'
import * as Haptics from 'expo-haptics'
import { throwError } from '../redux/errorReducer'

import { BarCodeScanner } from 'expo-barcode-scanner'
import { BlurView } from 'expo-blur'

const screen = Dimensions.get('screen')

import QRIcon from '../components/QRIcon'

import * as Animatable from 'react-native-animatable'

Animatable.initializeRegistryWithDefinitions({
  zoomIn: {
    0: { scale: 1 },
    1: { scale: 1.2 }
  },
  zoomOut: {
    0: { scale: 1.2 },
    1: { scale: 1 }
  },
  slideInUp: {
    from: { translateY: 100 },
    to: { translateY: 0 }
  }
})

const ScannerModalScreen = props => {
  const animationRef = useRef(null)

  const isScannerActive = useSelector(
    state => state.screen.scannerScreen.isScannerActive
  )
  console.log('isScannerActive: ', isScannerActive)

  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    if (isScannerActive && !hasPermission) {
      ;(async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync()
        setHasPermission(status === 'granted')
      })()
    }
  }, [isScannerActive])

  useEffect(() => {
    if (isScannerActive) {
      StatusBar.setBarStyle('light-content')
    } else {
      StatusBar.setBarStyle('dark-content')
    }
  }, [isScannerActive])

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true)
    alert(`Bar code with type ${type} and data ${data} has been scanned!`)
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: address
      })
    } catch (error) {
      dispatch(throwError(error))
      throw new Error(error)
    }
  }

  const navigation = useNavigation()

  const name = useSelector(state => state?.user?.name)
  const email = useSelector(state => state?.user?.email)
  const address = useSelector(state => state?.user?.wallet?.address)

  const dispatch = useDispatch()

  return (
    <BlurView
      style={{ ...StyleSheet.absoluteFill }}
      intensity={100}
      tint='dark'
    >
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: !isScannerActive ? Colors.White : Colors.Black }
        ]}
      >
        <View
          style={[
            styles.header,
            { backgroundColor: !isScannerActive ? Colors.White : Colors.Black }
          ]}
        >
          <TouchableOpacity
            style={{ marginLeft: 16 }}
            onPress={() => navigation.goBack()}
          >
            <Feather
              name='x'
              size={24}
              color={!isScannerActive ? Colors.Black : Colors.White}
            ></Feather>
          </TouchableOpacity>
        </View>

        {!isScannerActive ? (
          <View style={styles.QRCode}>
            <QRCode
              value='https://google.com'
              size={parseInt(screen.width * 0.65)}
            ></QRCode>
          </View>
        ) : (
          <View style={styles.QRScanner}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{
                width: parseInt(screen.width * 0.78),
                height: parseInt(screen.width * 0.78),
                borderRadius: 15,
                overflow: 'hidden'
              }}
            />
          </View>
        )}

        {!isScannerActive ? (
          <>
            <Text style={styles.title}>{name}</Text>
            <Text
              style={{ marginTop: 10, fontSize: 16, color: Colors.Gray600 }}
            >
              Scan to pay {email}
            </Text>
            <View style={styles.addressContainer}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20
                }}
                onPress={onShare}
              >
                <Text style={styles.address}>{`${(address || '').slice(
                  0,
                  12
                )}...${(address || '').slice(-11)}`}</Text>
                <Feather
                  name='share'
                  size={20}
                  color={Colors.Gray600}
                  width='2'
                ></Feather>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={{ marginTop: 120, fontSize: 16, color: Colors.White }}>
            Scan Avacash Code to Pay
          </Text>
        )}

        <View
          style={{
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            height: screen.height * 0.25,
            width: screen.width,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Animatable.View ref={animationRef} iterationCount={1}>
            <TouchableOpacity
              style={styles.roundButton}
              onPress={() => {
                dispatch(toggleScannerScreen())
                Haptics.impactAsync('medium')
                // Haptics.notificationAsync('success')
              }}
              onPressIn={() => {
                animationRef.current.zoomIn(60)
              }}
              onPressOut={() => {
                animationRef.current.zoomOut(120)
              }}
            >
              {!isScannerActive ? (
                <Feather name='maximize' size={30}></Feather>
              ) : (
                <QRIcon size={26}></QRIcon>
              )}
            </TouchableOpacity>
          </Animatable.View>
          <Text
            style={{
              marginTop: 10,
              fontSize: 12,
              fontWeight: '600',
              textTransform: 'uppercase',
              color: Colors.Black
            }}
          >
            {!isScannerActive ? 'Scan' : 'My Code'}
          </Text>
        </View>
      </SafeAreaView>
    </BlurView>
  )
}

export default ScannerModalScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    backgroundColor: Colors.White,
    alignItems: 'center',
    width: screen.width
  },
  QRCode: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    marginTop: 40,
    width: parseInt(screen.width * 0.8),
    height: parseInt(screen.width * 0.8),
    shadowColor: Colors.Gray300,
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 }
  },
  QRScanner: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginTop: 40,
    width: parseInt(screen.width * 0.8),
    height: parseInt(screen.width * 0.8),
    shadowColor: Colors.Gray600,
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 0 }
  },
  title: { marginTop: 40, fontSize: 25, fontWeight: '500' },
  subtitle: { marginTop: 10, fontSize: 16, color: Colors.Gray600 },
  addressContainer: {
    justifyContent: 'center',
    marginTop: 20,
    width: screen.width * 0.8,
    height: 60,
    backgroundColor: Colors.Gray100,
    borderRadius: 10
  },
  address: {
    color: Colors.Gray600,
    fontSize: 18,
    fontWeight: '500'
  },
  roundButton: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 50,
    backgroundColor: Colors.Gray200
  }
})
