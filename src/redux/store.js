import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './screenReducer'

// const rootReducer = combineReducers({ reducer })

const store = createStore(reducer, applyMiddleware(thunk))

export default store
