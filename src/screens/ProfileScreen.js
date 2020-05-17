import React, { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import Button from '../components/Button'
import { useDispatch, useSelector } from 'react-redux'

import { useHeaderHeight } from '@react-navigation/stack'

import Colors from '../constants/colors'
import { Feather } from '@expo/vector-icons'
import QRIcon from '../components/QRIcon'

import ProfileSettingsCell from '../components/ProfileSettingsCell'
import { useNavigation } from '@react-navigation/core'
import { signOut } from '../redux/authReducer'

const ProfileScreen = () => {
  const name = useSelector(state => state.user.name)
  const email = useSelector(state => state.user.email)
  const photoUrl = useSelector(state => state.user.photoUrl)

  const dispatch = useDispatch()
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            marginTop: 40
          }}
        >
          <Image
            source={{
              uri: photoUrl
            }}
            style={{ height: 80, width: 80, borderRadius: 40 }}
          ></Image>

          <Text
            style={{
              textAlign: 'center',
              fontSize: 28,
              fontWeight: '600',
              marginTop: 20,
              marginHorizontal: 25
            }}
          >
            {name}
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              textAlign: 'center',
              color: Colors.Gray500,
              marginTop: 10
            }}
          >
            {email}
          </Text>
        </View>

        <View style={{ marginTop: 40 }}>
          <ProfileSettingsCell
            title='Backup'
            icon='download'
          ></ProfileSettingsCell>
          <ProfileSettingsCell
            title='Security'
            icon='shield'
          ></ProfileSettingsCell>
          <ProfileSettingsCell
            title='Support'
            icon='message-circle'
          ></ProfileSettingsCell>

          <TouchableOpacity
            style={{
              marginTop: 50,
              backgroundColor: Colors.Gray200,
              height: 80,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={() => {
              navigation.navigate('SignIn')
              dispatch(signOut())
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: '500', color: Colors.Blue }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
