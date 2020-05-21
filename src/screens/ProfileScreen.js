import React, { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  SectionList,
  Share,
  Modal,
  TouchableHighlight
} from 'react-native'
import Button from '../components/Button'
import { useDispatch, useSelector } from 'react-redux'

import { useHeaderHeight } from '@react-navigation/stack'
import useScreenDimensions from '../hooks/useScreenDimensions'

import Colors from '../constants/colors'
import { Feather } from '@expo/vector-icons'
import QRIcon from '../components/QRIcon'

import ProfileSettingsCell from '../components/ProfileSettingsCell'
import { useNavigation } from '@react-navigation/core'
import { signOut } from '../redux/authReducer'

import * as Linking from 'expo-linking'

const renderItem = ({ item, navigation, dispatch }) => {
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
    data: [
      {
        id: 0,
        title: 'Backup Wallet',
        icon: 'cloud',
        navigateTo: 'Backup',
        onPress: navigation => {
          console.log(this)
          // this.navigation.navigate('Backup')
        }
      }
    ]
  },
  {
    id: 1,
    title: 'Help',
    data: [
      {
        id: 0,
        title: 'Help Center',
        icon: 'book',
        onPress: () => {}
      },
      {
        id: 1,
        title: 'Support',
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
      },
      {
        id: 2,
        title: 'Share With Friends',
        icon: 'share-2',
        onPress: () => {
          Share.share({
            title: 'Download Avacash',
            url: 'https://avacash.com'
          })
        }
      }
    ]
  }
]

const BackupModal = () => {
  const screen = useScreenDimensions()
  console.log('screen: ', screen)

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={false}
      onRequestClose={() => {
        alert('Modal has been closed.')
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            height: screen.height * 0.6,
            width: screen.width * 0.9,
            borderRadius: 20
          }}
        ></View>
      </View>
    </Modal>
  )
}

const ListHeader = () => {
  const name = useSelector(state => state.user.name)
  const email = useSelector(state => state.user.email)
  const photoUrl = useSelector(state => state.user.photoUrl)

  return (
    <View
      style={{
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 60
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

const ListFooter = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  return (
    <View style={{ backgroundColor: Colors.Gray100 }}>
      <TouchableOpacity
        style={{
          marginTop: 36,
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
      <Text
        style={{ marginLeft: 25, marginVertical: 25, color: Colors.Gray500 }}
      >
        Version: 0.0.0.1
      </Text>
    </View>
  )
}

const ProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: Colors.White }}>
        <SectionList
          sections={sections}
          renderItem={props => renderItem({ ...props, navigation })}
          keyExtractor={extractKey}
          renderSectionHeader={renderSectionHeader}
          navigation={navigation}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
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
