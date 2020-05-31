import { EXPLORER_API_HOST } from 'react-native-dotenv'
import { useSelector } from 'react-redux'
import { formatWei, formatAddress } from '../helpers'
import { firestore } from '../config/firebase'
import { getUserByAddress } from '../helpers'

export const FETCH_TXS_LOADING = 'FETCH_TXS_LOADING'
export const FETCH_TXS_SUCCESS = 'FETCH_TXS_SUCCESS'
export const FETCH_TXS_ERROR = 'FETCH_TXS_ERROR'
export const SET_HISTORY = 'SET_HISTORY'
export const SET_PENDING_TXS = 'SET_PENDING_TXS'
export const SET_LAST_INDEXED_TIMESTAMP = 'SET_LAST_INDEXED_TIMESTAMP'
export const ADD_TO_HISTORY = 'ADD_TO_HISTORY'
export const ADD_PENDING_TX = 'ADD_PENDING_TX'

const initialState = {
  loading: false,
  pendingTxs: [],
  history: [],
  error: null,
  lastIndexedTimestamp: null
}

export const setHistory = history => {
  return { type: SET_HISTORY, payload: history }
}

export const addToHistory = txs => (dispatch, getState) => {
  dispatch({ type: ADD_TO_HISTORY, payload: txs })
  let history = getState().transactions.history

  if (Array.isArray(txs)) {
    let set = new Set()
    let updatedHistory = [...history, ...txs].filter(item => {
      if (!set.has(item.id)) {
        set.add(item.id)
        return true
      }
      return false
    }, set)
    dispatch(setHistory(updatedHistory))
  } else dispatch(setHistory([...history, txs]))
}

export const addPendingTxs = tx => {
  dispatch({ type: ADD_PENDING_TX, payload: tx })
  const pendingTxs = getState().transactions.pendingTxs
  dispatch(setPengingTxs([...pendingTxs, tx]))
}

export const setPengingTxs = pendingTxs => {
  return { type: SET_PENDING_TXS, payload: pendingTxs }
}

export const setLastIndexedTimestamp = timestamp => {
  return { type: SET_LAST_INDEXED_TIMESTAMP, payload: timestamp }
}

export const fetchTxsLoading = () => {
  return { type: FETCH_TXS_LOADING }
}

export const fetchTxsSuccess = txs => {
  return { type: FETCH_TXS_SUCCESS, payload: txs }
}

export const fetchTxsError = error => {
  return { type: FETCH_TXS_ERROR, payload: error }
}

export const fetchTxs = () => async (dispatch, getState) => {
  const address = getState().user?.wallet?.address
  dispatch(fetchTxsLoading())

  try {
    let res = await fetch(`${EXPLORER_API_HOST}/account/${address}/txs`)
    res = await res.json()

    if (res.error) {
      throw res.error
    }

    const sortedTxs = await dispatch(sortTxs(res.data))

    dispatch(addToHistory(sortedTxs))
    dispatch(fetchTxsSuccess(sortedTxs))
  } catch (error) {
    dispatch(fetchTxsError(error.message || error))
  }
}

const sortTxs = txs => async (dispatch, getState) => {
  const userAddress = getState().user?.wallet?.address

  txs = [...new Set(txs)]

  let sortedTxs = []
  for (let i = 0; i < txs.length; i++) {
    const fromAddr = `0x${txs[i].from}`
    const toAddr = `0x${txs[i].to}`
    const txType =
      formatAddress(toAddr) == formatAddress(userAddress) ? 'in' : 'out'

    const user = await getUserByAddress(txType === 'in' ? fromAddr : toAddr)

    let timestamp = txs[i].blockCreationTime
    const lastIndexedTimestamp = getState().transactions.lastIndexedTimestamp

    if (timestamp > lastIndexedTimestamp)
      dispatch(setLastIndexedTimestamp(timestamp))

    let tx = {
      id: txs[i].txHash,
      title: user?.name || (txType === 'in' ? fromAddr : toAddr),
      timestamp: timestamp,
      amount: formatWei(txs[i].value),
      user,
      type: txType
    }
    sortedTxs.push(tx)
  }

  return sortedTxs
}

const transactionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TXS_LOADING:
      return { ...state, loading: true }
    case FETCH_TXS_SUCCESS:
      return { ...state, loading: false, txs: action.payload }
    case FETCH_TXS_ERROR:
      return { ...state, loading: false, error: action.payload }
    case SET_LAST_INDEXED_TIMESTAMP:
      return { ...state, lastIndexedTimestamp: action.payload }
    case SET_HISTORY:
      return { ...state, history: action.payload }
    case SET_PENDING_TXS: {
      return { ...state, pendingTxs: action.payload }
    }
    default:
      return state
  }
}

export default transactionsReducer
