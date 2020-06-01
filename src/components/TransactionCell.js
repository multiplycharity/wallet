import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackground
} from 'react-native'
import Colors from '../constants/colors'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'

import useScreenDimensions from '../hooks/useScreenDimensions'
import { isEthereumAddress } from '../helpers'

import { Feather } from '@expo/vector-icons'

const TransactionCell = props => {
  const navigation = useNavigation()
  const screen = useScreenDimensions()

  const TxCellImage = () => {
    const imgUrl = props.user?.photoUrl
    // `https://randomuser.me/api/portraits/med/men/${1}.jpg`

    return (
      <View
        style={{
          marginLeft: 25,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: props.type === 'out' ? Colors.Red75 : Colors.Green75,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {imgUrl ? (
          <ImageBackground
            style={{
              flex: 1,
              borderRadius: 20,
              width: '100%',
              height: '100%',
              overflow: 'hidden'
            }}
            source={{
              uri: imgUrl
            }}
          />
        ) : (
          <Feather
            name={props.type === 'out' ? 'arrow-up' : 'arrow-down'}
            size={21}
            color='white'
          ></Feather>
        )}
      </View>
    )
  }

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          height: 80,
          width: screen.width,
          justifyContent: 'space-between',
          paddingVertical: 20
        },
        props.style
      ]}
      onPress={() => navigation.navigate('Transaction', { ...props })}
    >
      <View style={{ flexDirection: 'row' }}>
        <TxCellImage imageUrl={props.imageUrl}></TxCellImage>
        <View style={{ marginLeft: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '500' }}>
            {isEthereumAddress(props.title)
              ? `${props.title.slice(0, 8)}...${props.title.slice(-7)}`
              : props.title}
          </Text>

          <Text
            style={{
              marginTop: 6,
              fontSize: 14,
              fontWeight: '400',
              color: Colors.Gray500
            }}
          >
            At {moment.unix(props.timestamp).format('HH:mm A')}
          </Text>
        </View>
      </View>

      <View style={{ marginRight: 25 }}>
        <Text
          style={{
            textAlign: 'right',
            fontSize: 18,
            fontWeight: '500',
            color: props.type === 'out' ? Colors.Red : Colors.Green
          }}
        >
          {props.type === 'out' ? '-$' : '$'}
          {props.amount}
        </Text>
        {props.status === 'pending' && (
          <Text
            style={{
              textAlign: 'right',
              marginTop: 6,
              fontSize: 14,
              fontWeight: '400',
              color: Colors.Gray500
            }}
          >
            Pending
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default TransactionCell
