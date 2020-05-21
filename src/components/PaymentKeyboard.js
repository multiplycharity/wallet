import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { handleOnPressIn } from '../redux/paymentKeyboardReducer'
import { Feather } from '@expo/vector-icons'
import { Dimensions } from 'react-native'

const buttons = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'C']
]

const Key = props => {
  const screen = Dimensions.get('screen')

  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        height: 80,
        width: screen.width / 3,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
    >
      {props.value === 'C' ? (
        <Feather name='chevron-left' size={24}></Feather>
      ) : (
        <Text style={{ fontSize: 21, fontWeight: '600' }}>{props.value}</Text>
      )}
    </TouchableOpacity>
  )
}

const PaymentKeyboard = props => {
  const dispatch = useDispatch()

  let layout = buttons.map((buttonRow, rowIndex) => {
    let rowItem = buttonRow.map((buttonItem, buttonIndex) => {
      return (
        <Key
          value={buttonItem}
          onPressIn={() => {
            dispatch(handleOnPressIn(buttonItem))
          }}
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

  return <View style={props.style}>{layout}</View>
}

export default PaymentKeyboard
