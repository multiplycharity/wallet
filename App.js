import * as React from 'react'
import { Text, View, Splash } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

import { Provider } from 'react-redux'
import { store, persistor } from './src/redux/store'
import { PersistGate } from 'redux-persist/integration/react'

import AppNavigator from './src/navigation/AppNavigator'

if (__DEV__) {
  import('./src/config/reactotron').then(() =>
    console.log('Reactotron Configured')
  )
}

export default function App () {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  )
}
