import React from 'react'
import { View, Text, Share, StyleSheet } from 'react-native'
import { useSelector, dispatch } from 'react-redux'
import useScreenDimensions from '../hooks/useScreenDimensions'
import Colors from '../constants/colors'
import Button from '../components/Button'
import Cell from '../components/Cell'
import { Feather } from '@expo/vector-icons'

const BackupScreen = props => {
  const { address, name, photoUrl, email, amount } = props.route.params

  const screen = useScreenDimensions()

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White
      }}
    >
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <Text style={[styles.sectionHeader, { marginTop: 40, marginLeft: 40 }]}>
          Amount
        </Text>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            marginLeft: 40,
            marginTop: 10
          }}
        >
          ${amount}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: Colors.Gray100,
          flex: 2
        }}
      >
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            backgroundColor: Colors.Gray100,
            marginLeft: 25,
            position: 'absolute',
            top: -15,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              height: 34,
              width: 34,
              borderRadius: 18,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Feather name='arrow-down' size={24} color={Colors.Blue}></Feather>
          </View>
        </View>

        <Text style={[styles.sectionHeader, { marginTop: 60, marginLeft: 40 }]}>
          To
        </Text>

        <Cell
          title={name}
          subtitle={email}
          imageSize={50}
          titleSize={21}
          subtitleSize={16}
          imageUrl={photoUrl}
          imageBgColor='#bccddf'
          style={{ marginLeft: 15, marginTop: 10 }}
        ></Cell>

        <View
          style={{
            alignItems: 'center',
            position: 'absolute',
            bottom: screen.height > 800 ? 60 : 40,
            left: 25
          }}
        >
          <Button
            title='Confirm'
            color={Colors.White}
            width={screen.width - 50}
            backgroundColor={Colors.Blue}
            style={{
              marginTop: 40,
              paddingHorizontal: 20
            }}
            onPress={() => {
              console.log('Pressed confirm')
            }}
          ></Button>
        </View>
      </View>
    </View>
  )
}

export default BackupScreen

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 12,
    color: Colors.Gray500,
    fontWeight: '600',
    textTransform: 'uppercase'
  }
})
