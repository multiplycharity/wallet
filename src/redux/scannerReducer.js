export const SET_SCANNED_ADDRESS = 'SET_SCANNED_ADDRESS'

export const setScannedAddress = address => {
  return { type: SET_SCANNED_ADDRESS, payload: address }
}

const initialState = {
  scannedAddress: null
}

const scannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SCANNED_ADDRESS:
      return { ...state, scannedAddress: action.payload }
    default:
      return state
  }
}

export default scannerReducer
