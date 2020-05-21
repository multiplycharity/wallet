import React, { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Share,
  LayoutAnimation
} from 'react-native'

import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

import Colors from '../constants/colors'
import { Feather } from '@expo/vector-icons'
import QRCode from 'react-native-qrcode-svg'
import { toggleScannerScreen } from '../redux/screenReducer'
import * as Haptics from 'expo-haptics'
import { throwError } from '../redux/errorReducer'

const screen = Dimensions.get('screen')

const onClose = () => {}

const MyCodeScreen = props => {
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

  const isScannerActive = useSelector(
    state => state.screen.scannerScreen.isScannerActive
  )

  const dispatch = useDispatch()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginLeft: 16 }}
          onPress={() => navigation.goBack()}
        >
          <Feather name='x' size={24} color={Colors.Black}></Feather>
        </TouchableOpacity>
      </View>

      <View style={styles.QRCode}>
        <QRCode
          value='https://google.com'
          size={parseInt(screen.width * 0.65)}
        ></QRCode>
      </View>

      <Text style={styles.title}>{name}</Text>
      <Text style={styles.subtitle}>Scan to pay {email}</Text>

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
          <Text style={styles.address}>{`${(address || '').slice(0, 12)}...${(
            address || ''
          ).slice(-11)}`}</Text>
          <Feather
            name='share'
            size={20}
            color={Colors.Gray600}
            width='2'
          ></Feather>
        </TouchableOpacity>
      </View>

      <View
        style={{
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
            textTransform: 'uppercase'
          }}
        >
          {!isScannerActive ? 'Scan' : 'My Code'}
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default MyCodeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
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
