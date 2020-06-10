import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native'

const defaultProps = {
  backgroundColor: 'white',
  color: 'lightgray'
}

const ModalHeader = props => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        backgroundColor: props.backgroundColor || defaultProps.backgroundColor
      }}
    >
      <View
        style={{
          backgroundColor: props.color || defaultProps.color,
          height: 5,
          width: 30,
          borderRadius: 10
        }}
      />
    </View>

    // <TouchableOpacity><Feather></Feather></TouchableOpacity>
  )
}

export default React.memo(ModalHeader)

const styles = StyleSheet.create({})
