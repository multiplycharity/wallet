import * as React from 'react'
import { Text, View, Splash } from 'react-native'

import { NotifierWrapper } from 'react-native-notifier'

import { Provider } from 'react-redux'
import { store, persistor } from './src/redux/store'
import { PersistGate } from 'redux-persist/integration/react'

import RootNavigator from './src/navigation/RootNavigator'

if (__DEV__) {
  import('./src/config/reactotron').then(() =>
    console.log('Reactotron Configured')
  )
}

export default function App () {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NotifierWrapper>
          <RootNavigator />
        </NotifierWrapper>
      </PersistGate>
    </Provider>
  )
}
