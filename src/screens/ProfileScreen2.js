import React, { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  SectionList
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

import * as Linking from 'expo-linking'

const renderItem = ({ item }) => {
  return <ProfileSettingsCell {...item} />
}

const extractKey = ({ id }) => id

const renderSectionHeader = ({ section }) => {
  return <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
}
let sections = [
  {
    id: 0,
    title: 'Security',
    data: [{ id: 0, title: 'Backup wallet', icon: 'download' }]
  },
  {
    id: 1,
    title: 'Help',
    data: [
      {
        id: 0,
        title: 'Get support',
        icon: 'mail',
        onPress: () => {
          Linking.openURL('mailto:amiromayer@gmail.com?subject=Support')
        }
      }
    ]
  },
  {
    id: 2,
    title: 'Social',
    data: [
      {
        id: 0,
        title: 'Twitter',
        icon: 'twitter',
        onPress: () => {
          Linking.openURL('https://twitter.com/amiromayer')
        }
      },
      {
        id: 1,
        title: 'Telegram',
        icon: 'send',
        onPress: () => {
          Linking.openURL('https://t.me/genesisblock')
        }
      }
    ]
  }
]

const ListHeader = () => {
  const name = useSelector(state => state.user.name)
  const email = useSelector(state => state.user.email)
  const photoUrl = useSelector(state => state.user.photoUrl)

  return (
    <View
      style={{
        alignItems: 'center',
        marginVertical: 40
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
  )
}

const ProfileScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: Colors.Gray100 }}>
        <SectionList
          sections={sections}
          renderItem={renderItem}
          keyExtractor={extractKey}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={() => {
            return (
              <TouchableOpacity
                style={{
                  marginVertical: 36,
                  backgroundColor: Colors.White,
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
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    color: Colors.Blue
                  }}
                >
                  Sign Out
                </Text>
              </TouchableOpacity>
            )
          }}
        ></SectionList>
      </View>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White
  },

  sectionHeader: {
    backgroundColor: Colors.Gray100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 12,
    color: Colors.Gray500,
    fontWeight: '600'
  }
})
