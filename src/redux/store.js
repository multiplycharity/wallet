import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import logger from 'redux-logger'

import { AsyncStorage } from 'react-native'

import screenReducer from './screenReducer'
import authReducer from './authReducer'

const rootReducer = combineReducers({
  screen: screenReducer,
  auth: authReducer
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedReducer,
  undefined,
  applyMiddleware(logger, thunk)
)
export const persistor = persistStore(store)

export default store
