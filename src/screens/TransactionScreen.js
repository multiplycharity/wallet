import React, { useLayoutEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Button
} from 'react-native'
import * as WebBrowser from 'expo-web-browser'

import Colors from '../constants/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

const TransactionScreen = props => {
  const navigation = useNavigation()

  React.useLayoutEffect(() => {
    navigation.setOptions({
      tabBarVisible: false
    })
  }, [navigation])

  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{
          uri: `https://randomuser.me/api/portraits/med/men/11.jpg`
        }}
      />
      <Text style={{ marginTop: 20, fontSize: 21, fontWeight: '500' }}>
        John Doe
      </Text>
      <Text
        style={{
          marginTop: 5,
          fontSize: 16,
          fontWeight: '400',
          color: Colors.Gray500
        }}
      >
        Payment to johndoe@gmail.com
      </Text>

      <Text
        style={{
          marginTop: 120,
          fontSize: 60,
          fontWeight: '400'
        }}
      >
        $5.00
      </Text>
      <Text
        style={{
          marginTop: 5,
          fontSize: 16,
          fontWeight: '400',
          color: Colors.Gray500
        }}
      >
        Today at 11:37 AM
      </Text>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          marginBottom: 64
        }}
      >
        <TouchableOpacity
          onPress={async () => {
            await WebBrowser.openBrowserAsync('https://google.com')
          }}
        >
          <Text
            style={{
              fontSize: 21,
              fontWeight: '500',
              color: Colors.Blue
            }}
          >
            More Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default TransactionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.White
  },
  avatar: { marginTop: 40, width: 80, height: 80, borderRadius: 40 }
})
