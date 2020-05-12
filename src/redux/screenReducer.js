// Action Types
export const TOGGLE_SEARCH_BAR = 'TOGGLE_SEARCH_BAR'
export const TOGGLE_SCANNER_SCREEN = 'TOGGLE_SCANNER_SCREEN'

// Action Creators
export const toggleSearchBar = () => ({ type: TOGGLE_SEARCH_BAR })
export const toggleScannerScreen = () => ({ type: TOGGLE_SCANNER_SCREEN })

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
    // case DELETE_TODO:
    //   const filteredArray = state.filter(todo => todo.id !== action.payload)
    //   return filteredArray
    default:
      return state
  }
}

export default screenReducer
