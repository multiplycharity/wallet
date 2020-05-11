import React, { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Share
} from 'react-native'
import Colors from '../constants/colors'
import { Feather } from '@expo/vector-icons'
import QRCode from 'react-native-qrcode-svg'

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

const MyCodeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{ marginLeft: 14 }}>
          <Feather name='x' size={24} color={Colors.Black}></Feather>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginRight: 14 }} onPress={onShare}>
          <Feather name='share' size={24} color={Colors.Black}></Feather>
        </TouchableOpacity>
      </View>

      <View style={styles.QRCode}>
        <QRCode
          value='https://google.com'
          size={parseInt(screen.width * 0.65)}
        ></QRCode>
      </View>

      <Text style={styles.title}>Amir</Text>
      <Text style={styles.subtitle}>Scan to pay amiromayer@gmail.com</Text>

      <View style={styles.addressContainer}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20
          }}
        >
          <Text style={styles.address}>7p3QqbzZFZ…H53Xku6wvN</Text>
          <Feather
            name='copy'
            size={22}
            color={Colors.Gray600}
            width='2'
          ></Feather>
        </TouchableOpacity>
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
  roundButton: {}
})
