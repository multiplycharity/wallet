import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer, PURGE } from 'redux-persist'
import logger from 'redux-logger'
import reactotron from '../config/reactotron'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import { AsyncStorage } from 'react-native'

import screenReducer from './screenReducer'
import authReducer from './authReducer'
import userReducer from './userReducer'
import errorReducer from './errorReducer'
import loadingReducer from './loadingReducer'
import lastActionReducer from './lastActionReducer'
import transactionsReducer from './transactions'
import scannerReducer from './scannerReducer'
import deepLinkReducer from './deepLinkReducer'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['isLoading', 'transactions', 'lastAction', 'deepLink']
}

// const transactionsConfig = {
//   key: 'transactions',
//   storage: AsyncStorage,
//   blacklist: ['pendingTxs']
// }

const appReducer = combineReducers({
  screen: screenReducer,
  auth: authReducer,
  user: userReducer,
  error: errorReducer,
  isLoading: loadingReducer,
  lastAction: lastActionReducer,
  transactions: transactionsReducer,
  scanner: scannerReducer,
  deepLink: deepLinkReducer
})

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = undefined
    AsyncStorage.clear()
  }

  return appReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middleware = [thunk]

const composeEnhancers = composeWithDevTools({})

const enhancer = composeEnhancers(
  applyMiddleware(...middleware),
  reactotron.createEnhancer()
)

export const store = createStore(persistedReducer, undefined, enhancer)
export const persistor = persistStore(store)

export default store
