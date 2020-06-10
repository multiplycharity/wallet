const SET_DEEP_LINK = 'SET_DEEP_LINK'
const RESET_DEEP_LINK = 'RESET_DEEP_LINK'

import { Linking } from 'expo'

export const setDeepLink = deepLink => {
  return { type: SET_DEEP_LINK, payload: deepLink }
}

export const resetDeepLink = () => {
  return { type: RESET_DEEP_LINK }
}
const initialState = { deepLink: '', path: '', queryParams: {} }

const deepLinkReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DEEP_LINK: {
      let { path, queryParams } = Linking.parse(action.payload)
      return { ...state, deepLink: action.payload, path, queryParams }
    }
    case RESET_DEEP_LINK: {
      return initialState
    }

    default:
      return state
  }
}

export default deepLinkReducer
