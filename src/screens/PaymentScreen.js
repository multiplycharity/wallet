import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Colors from '../constants/colors'
import useScreenDimensions from '../hooks/useScreenDimensions'
import { TouchableOpacity } from 'react-native-gesture-handler'

const PaymentScreen = ({ navigation }) => {
  const [displayValue, setDisplayValue] = useState('0')

  const [wholePart, setWholePart] = useState('0')
  console.log('wholePart: ', wholePart)
  const [fractionalPart, setFractionalPart] = useState('')
  console.log('fractionalPart: ', fractionalPart)

  const [isFractionalPart, setIsFractionalPart] = useState(false)
  console.log('isFractionalPart: ', isFractionalPart)

  const [dotExists, setDotExists] = useState(false)

  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'C']
  ]

  const Key = props => {
    const screen = useScreenDimensions()
    const value = props.value
    return (
      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          height: 80,
          width: screen.width / 3,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={props.onPress}
      >
        <Text style={{ fontSize: 21, fontWeight: '600' }}>{props.value}</Text>
      </TouchableOpacity>
    )
  }

  const Keyboard = props => {
    let layouts = buttons.map((buttonRows, rowIndex) => {
      let rowItem = buttonRows.map((buttonItems, buttonIndex) => {
        return (
          <Key
            value={buttonItems}
            onPress={() => handleInput(buttonItems)}
            key={'btn-' + buttonIndex}
          ></Key>
        )
      })

      return (
        <View style={{ flexDirection: 'row' }} key={'row-' + rowIndex}>
          {rowItem}
        </View>
      )
    })

    return layouts
  }

  const handleInput = input => {
    switch (input) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if (isFractionalPart && fractionalPart.length >= 2) break
        if (!isFractionalPart && wholePart.length >= 5) break

        isFractionalPart
          ? setFractionalPart(fractionalPart + input)
          : setWholePart(wholePart === '0' ? input : wholePart + input)
        setDisplayValue(displayValue === '0' ? input : displayValue + input)
        break
      case '.':
        setDisplayValue(!isFractionalPart ? displayValue + input : displayValue)
        setIsFractionalPart(true)
        break
      case 'C':
        if (displayValue.length === 1) {
          setDisplayValue('0')
          setWholePart('0')

          break
        }

        if (displayValue.slice(-1) === '.') {
          setIsFractionalPart(false)
          setDotExists(false)
        }

        setDisplayValue(
          displayValue !== '0' ? displayValue.slice(0, -1) : displayValue
        )

        if (isFractionalPart) {
          setFractionalPart(
            fractionalPart !== '0'
              ? fractionalPart.slice(0, -1)
              : fractionalPart
          )
        } else {
          setWholePart(wholePart !== '0' ? wholePart.slice(0, -1) : wholePart)
        }
        break
    }
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontSize:
                displayValue.length <= 4
                  ? 84
                  : displayValue.length <= 6
                  ? 72
                  : 64,
              fontWeight: '700',
              paddingHorizontal: 25,
              marginBottom: 40
            }}
          >
            ${displayValue}
          </Text>
          <Keyboard></Keyboard>
        </View>
      </SafeAreaView>
    </>
  )
}

export default PaymentScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Blue
  }
})
