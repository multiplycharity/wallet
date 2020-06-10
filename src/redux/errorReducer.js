import { Notifier, NotifierComponents, Easing } from 'react-native-notifier'
import { Colors } from 'react-native/Libraries/NewAppScreen'

export const THROW_ERROR = 'THROW_ERROR'
export const CLEAR_ERROR = 'CLEAR_ERROR'

const initialState = {
  error: null
}

export const throwError = (error, title = '') => (dispatch, getState) => {
  dispatch({ type: THROW_ERROR, payload: error })

  const description = error.message ? error.message : error

  Notifier.showNotification({
    title: title || 'Error occured',
    description: description,
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: 'error',
      backgroundColor: Colors.Red
    },
    duration: 3600,
    showAnimationDuration: 800,
    showEasing: Easing.bounce
  })
}

export const clearError = () => {
  return {
    type: CLEAR_ERROR
  }
}

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case THROW_ERROR:
      return { ...state, error: action.payload }
    case CLEAR_ERROR:
      return { ...state, error: null }
    default:
      return state
  }
}

export default errorReducer
