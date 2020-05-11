import { createStore, combineReducers } from 'redux'
import reducer from './reducer'

// const rootReducer = combineReducers({ reducer })

const store = createStore(reducer)

export default store
