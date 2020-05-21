const SET_WHOLE_PART = 'SET_WHOLE_PART'
const SET_FRACTIONAL_PART = 'SET_FRACTIONAL_PART'
const SET_IS_FRACTIONAL_PART = 'SET_IS_FRACTIONAL_PART'
const SET_DISPLAY_VALUE = 'SET_DISPLAY_VALUE'

const initialState = {
  wholePart: '0',
  fractionalPart: '',
  isFractionalPart: false,
  displayValue: '0'
}

export const setFractionalPart = value => {
  return { type: 'SET_FRACTIONAL_PART', payload: value }
}

export const setWholePart = value => {
  return { type: 'SET_WHOLE_PART', payload: value }
}

export const setIsFractionalPart = bool => {
  return { type: 'SET_IS_FRACTIONAL_PART', payload: bool }
}

export const setDisplayValue = value => {
  return { type: 'SET_DISPLAY_VALUE', payload: value }
}

export const handleOnPressOut = key => (dispatch, getState) => {}

export const handleOnPressIn = key => (dispatch, getState) => {
  const {
    isFractionalPart,
    fractionalPart,
    wholePart,
    displayValue,
    invalidValue
  } = getState().paymentKeyboard

  switch (key) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      if (isFractionalPart && fractionalPart.length >= 2) {
        break
      }
      if (!isFractionalPart && wholePart.length >= 5) {
        break
      }

      isFractionalPart
        ? dispatch(setFractionalPart(fractionalPart + key))
        : dispatch(setWholePart(wholePart === '0' ? key : wholePart + key))

      dispatch(setDisplayValue(displayValue === '0' ? key : displayValue + key))
      break
    case '.':
      if (wholePart === '0') {
        break
      }
      dispatch(
        setDisplayValue(!isFractionalPart ? displayValue + key : displayValue)
      )
      dispatch(setIsFractionalPart(true))
      break
    case 'C':
      if (displayValue.length === 1) {
        dispatch(setDisplayValue('0'))
        dispatch(setWholePart('0'))
        break
      } else {
        if (displayValue.slice(-1) === '.') {
          dispatch(setIsFractionalPart(false))
        }

        dispatch(
          setDisplayValue(
            displayValue !== '0' ? displayValue.slice(0, -1) : displayValue
          )
        )

        if (isFractionalPart) {
          dispatch(
            setFractionalPart(
              fractionalPart !== '0'
                ? fractionalPart.slice(0, -1)
                : fractionalPart
            )
          )
        } else {
          dispatch(
            setWholePart(wholePart !== '0' ? wholePart.slice(0, -1) : wholePart)
          )
        }
      }
  }
}

const paymentKeyboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FRACTIONAL_PART:
      return { ...state, fractionalPart: action.payload }
    case SET_WHOLE_PART:
      return { ...state, wholePart: action.payload }
    case SET_IS_FRACTIONAL_PART:
      return { ...state, isFractionalPart: action.payload }
    case SET_DISPLAY_VALUE:
      return { ...state, displayValue: action.payload }

    default:
      return state
  }
}

export default paymentKeyboardReducer
