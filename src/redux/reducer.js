// Action Types
export const TOGGLE_SEARCH_BAR = 'TOGGLE_SEARCH_BAR'

const initialState = { searchBarActive: false }

// Action Creators
export const toggleSearchBar = () => {
  type: TOGGLE_SEARCH_BAR
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SEARCH_BAR:
      return { ...state, searchBarActive: !state.searchBarActive }
    // case DELETE_TODO:
    //   const filteredArray = state.filter(todo => todo.id !== action.payload)
    //   return filteredArray
    default:
      return state
  }
}

export default reducer
