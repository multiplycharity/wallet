import * as Permissions from 'expo-permissions'
import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'
import { BlurView } from 'expo-blur'
import BarcodeMask from '../components/BarcodeMask'
import { Camera } from 'expo-camera'
import SvgFigure from '../components/svg'

/**
 *   <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
 */

export default function App ({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true)
    alert(data)
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ ...StyleSheet.absoluteFill }}
      >
        {/*<BarcodeMask
          height={340}
          width={340}
          edgeRadius={20}
          outerMaskOpacity={0.3}
        />*/}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)'
          }}
        >
          <SvgFigure
            style={{
              position: 'absolute',

              justifyContent: 'center',
              alignItems: 'center'
            }}
          ></SvgFigure>
        </View>
      </Camera>

      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}

      <Button title='Back' onPress={() => navigation.goBack()} />
    </View>
  )
}

/**
 *  // <View
        //   style={{
        //     ...StyleSheet.absoluteFillObject
        //   }}
        // >
        //   <View
        //     style={{
        //       flex: 1,
        //       justifyContent: 'center',
        //       alignItems: 'center',
        //       backgroundColor: 'rgba(0,0,0,0.25)'
        //     }}
        //   >
        //     <View
        //       style={{
        //         height: 340,
        //         width: 340,
        //         backgroundColor: 'transparent'
        //       }}
        //     ></View>
        //   </View>
        // </View>
 */
