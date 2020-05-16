import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import logger from 'redux-logger'
import reactotron from '../config/reactotron'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import { AsyncStorage } from 'react-native'

import screenReducer from './screenReducer'
import authReducer from './authReducer'
import userReducer from './userReducer'
import errorReducer from './errorReducer'
import loadingReducer from './loadingReducer'

const appReducer = combineReducers({
  screen: screenReducer,
  auth: authReducer,
  user: userReducer,
  error: errorReducer,
  isLoading: loadingReducer
})

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = undefined
  }
  return appReducer(state, action)
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['isLoading']
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
