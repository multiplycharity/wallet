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

const ActivityCell = props => {
  const navigation = useNavigation()
  const screen = useScreenDimensions()

  const TxCellImage = () => {
    const imgUrl = props.user?.imageUrl

    // `https://randomuser.me/api/portraits/med/men/${1}.jpg`

    return (
      <View
        style={{
          marginLeft: 25,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: Colors.Gray200,
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
              uri: `https://randomuser.me/api/portraits/med/men/${1}.jpg`
            }}
          />
        ) : (
          <Feather
            name={props.type === 'in' ? 'arrow-down' : 'arrow-up'}
            size={18}
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
      onPress={() => navigation.navigate('Transaction')}
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
            At {moment(props.timestamp).format('HH:mm A')}
          </Text>
        </View>
      </View>

      <Text style={{ marginRight: 25, fontSize: 18, fontWeight: '500' }}>
        {props.type === 'out' ? '-$' : '$'}
        {props.amount}
      </Text>
    </TouchableOpacity>
  )
}

export default ActivityCell
