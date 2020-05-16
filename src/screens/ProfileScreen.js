import React, { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { signOut } from '../redux/authReducer'

import Colors from '../constants/colors'
import { Feather } from '@expo/vector-icons'
import QRIcon from '../components/QRIcon'

const ProfileScreen = () => {
  const name = useSelector(state => state.user.name)
  const email = useSelector(state => state.user.email)
  const photoUrl = useSelector(state => state.user.photoUrl)

  const dispatch = useDispatch()

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
          backgroundColor: Colors.White,
          paddingHorizontal: 14
        }}
      >
        <TouchableOpacity onPress={() => {}}>
          <QRIcon size={22}></QRIcon>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            dispatch(signOut())
          }}
        >
          <Feather size={22} name='log-out'></Feather>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Image
          source={{
            uri: photoUrl
          }}
          style={{ height: 80, width: 80, borderRadius: 40 }}
        ></Image>
        <Text style={{ fontSize: 28, fontWeight: '600', marginTop: 20 }}>
          {name}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '500',
            color: Colors.Gray500,
            marginTop: 10
          }}
        >
          {email}
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White
  }
})
