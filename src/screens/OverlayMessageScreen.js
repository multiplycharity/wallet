import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Colors from '../constants/colors'
import { Feather } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { resetPaymentScreen } from '../redux/screenReducer'
// import { useNavigation } from '@react-navigation/native'

const OverlayMessageScreen = props => {
  const dispatch = useDispatch()
  const navigation = props.navigation

  const { message, type } = props.route.params

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <View
        style={{
          height: 60,
          width: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            type === 'success'
              ? Colors.Lime
              : type === 'error'
              ? Colors.Red
              : Colors.Gray500
        }}
      >
        <Feather
          name={type === 'success' ? 'check' : 'x'}
          size={36}
          color={Colors.White}
          style={{ marginTop: 8 }}
        ></Feather>
      </View>
      <Text
        style={{
          fontSize: 18,
          textAlign: 'center',
          fontWeight: '500',
          marginTop: 20
        }}
      >
        {message}
      </Text>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          marginBottom: 64
        }}
      >
        <TouchableOpacity
          onPress={() => {
            // dispatch(resetPaymentScreen())
            navigation.navigate('Home')
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              color: Colors.Blue
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default OverlayMessageScreen
