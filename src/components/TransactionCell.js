import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity
} from 'react-native'
import Colors from '../constants/colors'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'

import useScreenDimensions from '../hooks/useScreenDimensions'

const ActivityCell = props => {
  const navigation = useNavigation()
  const screen = useScreenDimensions()

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
        <Image
          style={{ marginLeft: 25, width: 40, height: 40, borderRadius: 20 }}
          source={{
            uri: props.imageUrl
          }}
        />
        <View style={{ marginLeft: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '500' }}>{`${(
            props.title || ''
          ).slice(0, 8)}...${(props.title || '').slice(-7)}`}</Text>

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
