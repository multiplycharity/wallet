// Action Types
export const TOGGLE_SEARCH_BAR = 'TOGGLE_SEARCH_BAR'
export const TOGGLE_SCANNER_SCREEN = 'TOGGLE_SCANNER_SCREEN'
export const SET_IS_SCANNER_ACTIVE = 'SET_IS_SCANNER_ACTIVE'

export const RESET_PAYMENT_SCREEN = 'RESET_PAYMENT_SCREEN'

// Action Creators
export const toggleSearchBar = () => ({ type: TOGGLE_SEARCH_BAR })
export const toggleScannerScreen = () => ({ type: TOGGLE_SCANNER_SCREEN })
export const setIsScannerActive = bool => ({
  type: SET_IS_SCANNER_ACTIVE,
  payload: bool
})

export const resetPaymentScreen = () => ({
  type: RESET_PAYMENT_SCREEN
})

const initialState = {
  homeScreen: { isSearchBarActive: false },
  scannerScreen: { isScannerActive: false }
}

const screenReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SEARCH_BAR:
      return {
        ...state,
        homeScreen: { isSearchBarActive: !state.homeScreen.isSearchBarActive }
      }
    case TOGGLE_SCANNER_SCREEN:
      return {
        ...state,
        scannerScreen: { isScannerActive: !state.scannerScreen.isScannerActive }
      }
    case SET_IS_SCANNER_ACTIVE:
      return { ...state, scannerScreen: { isScannerActive: action.payload } }
    default:
      return state
  }
}

export default screenReducer
