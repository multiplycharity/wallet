import React from 'react'
import { View, Text, Share } from 'react-native'
import { useSelector, dispatch } from 'react-redux'
import useScreenDimensions from '../hooks/useScreenDimensions'
import Colors from '../constants/colors'
import Button from '../components/Button'

const BackupScreen = ({ height = 200, width = 300 }) => {
  const mnemonic = useSelector(state => state.user?.wallet?.mnemonic)

  const screen = useScreenDimensions()

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '500' }}>Recovery phrase</Text>
      <View
        style={{
          backgroundColor: Colors.Gray100,
          borderRadius: 20,
          maxWidth: screen.width * 0.85,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 40
        }}
      >
        <Text style={{ padding: 40, fontSize: 21, lineHeight: 36 }}>
          {mnemonic}
        </Text>
      </View>

      <Button
        title='Share'
        width={180}
        style={{ marginTop: 40, paddingHorizontal: 20 }}
        onPress={() => {
          Share.share({
            title: 'Avacash Recovery Phrase',
            message: mnemonic
          })
        }}
      ></Button>
    </View>
  )
}

export default BackupScreen
