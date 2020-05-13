import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Share,
  StatusBar,
  LayoutAnimation
} from 'react-native'

import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

import Colors from '../constants/colors'
import { Feather } from '@expo/vector-icons'
import QRCode from 'react-native-qrcode-svg'
import { toggleScannerScreen } from '../redux/screenReducer'
import ScannerMask from '../components/ScannerMask'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'

const screen = Dimensions.get('screen')

const onShare = async () => {
  try {
    const result = await Share.share({
      message: '7p3QqbzZFZ…H53Xku6wvN'
    })
  } catch (err) {
    alert(err.message)
  }
}

const onClose = () => {}

const MyCodeScreen = props => {
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)

  LayoutAnimation.configureNext({
    duration: 400,
    create: {
      type: LayoutAnimation.Types.spring,
      property: LayoutAnimation.Properties.scaleXY,
      springDamping: 0.7
    },
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.7
    }
  })

  useEffect(() => {
    ;(async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true)
    alert(`Bar code with type ${type} and data ${data} has been scanned!`)
  }

  const navigation = useNavigation()

  const isScannerActive = useSelector(
    state => state.screen.scannerScreen.isScannerActive
  )

  const dispatch = useDispatch()

  return (
    <BlurView
      style={{ ...StyleSheet.absoluteFill }}
      intensity={100}
      tint='dark'
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle='light-content' />

        <View style={styles.header}>
          <TouchableOpacity
            style={{ marginLeft: 14 }}
            onPress={() => navigation.goBack()}
          >
            <Feather name='x' size={24} color={Colors.White}></Feather>
          </TouchableOpacity>
        </View>

        <View style={styles.QRCode}>
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

        <Text style={styles.subtitle}>Scan Avacash Code to Pay</Text>

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
          <TouchableOpacity
            style={styles.roundButton}
            onPress={() => {
              dispatch(toggleScannerScreen())

              Haptics.impactAsync('medium')
            }}
          >
            <Feather name='maximize' size={30}></Feather>
          </TouchableOpacity>
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

export default MyCodeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.Black
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    alignItems: 'center',
    width: screen.width
  },
  QRCode: {
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

  subtitle: { marginTop: 120, fontSize: 16, color: Colors.White },

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
