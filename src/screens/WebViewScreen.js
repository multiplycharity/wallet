import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'

const WebViewScreen = props => {
  let url
  if (props.link) url = props.link
  else if (props.navigation.state) url = props.navigation.state.params.url
  else url = 'https://google.com'

  return <WebView source={{ uri: url }} startInLoadingState={true} />
}

export default WebViewScreen

const styles = StyleSheet.create({})
