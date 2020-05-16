import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Colors from '../constants/colors'
import * as Haptics from 'expo-haptics'

const ProfileSettingsCell = props => {
  const { icon, title } = props

  return (
    <TouchableOpacity
      style={[
        {
          alignItems: 'center',
          height: 100,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 25,
          backgroundColor: Colors.White
        },
        props.style
      ]}
      onPress={() => {
        Haptics.impactAsync('medium')
        if (typeof props.onPress === 'function') props.onPress()
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
            backgroundColor: Colors.Gray200,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Feather name={icon} size={24}></Feather>
        </View>
        <Text style={{ fontSize: 21, fontWeight: '500', marginLeft: 20 }}>
          {title}
        </Text>
      </View>

      <Feather name='chevron-right' size={24} color={Colors.Gray400}></Feather>
    </TouchableOpacity>
  )
}

export default ProfileSettingsCell
