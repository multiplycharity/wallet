import React from 'react'
import { View, Text } from 'react-native'

import { useSelector, useDispatch } from 'react-redux'
import MyCodeScreen from './MyCodeScreen'
import QRScannerScreen from './QRScannerScreen'

const ScannerModalScreen = () => {
  const isScannerActive = useSelector(
    state => state.screen.scannerScreen.isScannerActive
  )

  return !isScannerActive ? (
    <MyCodeScreen></MyCodeScreen>
  ) : (
    <QRScannerScreen></QRScannerScreen>
  )
}

export default ScannerModalScreen
