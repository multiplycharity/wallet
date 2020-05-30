import { EXPLORER_API_HOST } from 'react-native-dotenv'
import { useSelector } from 'react-redux'
import { formatWei, formatAddress } from '../helpers'
import { firestore } from '../config/firebase'

export const FETCH_TXS_PENDING = 'FETCH_TXS_PENDING'
export const FETCH_TXS_SUCCESS = 'FETCH_TXS_SUCCESS'
export const FETCH_TXS_ERROR = 'FETCH_TXS_ERROR'

export const fetchTxsPending = () => {
  return { type: FETCH_TXS_PENDING }
}

export const fetchTxsSuccess = txs => {
  return { type: FETCH_TXS_SUCCESS, payload: txs }
}

export const fetchTxsError = error => {
  return { type: FETCH_TXS_ERROR, payload: error }
}

export const fetchTxs = () => async (dispatch, getState) => {
  const address = getState().user?.wallet?.address
  dispatch(fetchTxsPending())

  try {
    let res = await fetch(`${EXPLORER_API_HOST}/account/${address}/txs`)
    res = await res.json()

    if (res.error) {
      throw res.error
    }

    dispatch(sortTxs(res.data))
  } catch (error) {
    dispatch(fetchTxsError(res.error))
  }
}

const getUserByAddress = async address => {
  address = formatAddress(address)

  let docs = []

  const snapshot = await firestore
    .collection('users')
    .where('address', '==', address)
    .get()

  snapshot.docs.forEach(doc => {
    docs.push(doc.data())
  })

  if (docs.length !== 1) return null

  return docs[0]
}

const sortTxs = txs => async (dispatch, getState) => {
  const userAddress = getState().user?.wallet?.address

  let transactions = []
  for (let i = 0; i < txs.length; i++) {
    const fromAddr = `0x${txs[i].from}`
    const toAddr = `0x${txs[i].to}`
    const txType =
      formatAddress(toAddr) == formatAddress(userAddress) ? 'in' : 'out'

    const user = await getUserByAddress(txType === 'in' ? fromAddr : toAddr)

    let tx = {
      id: txs[i].txHash,
      title: user?.name || (txType === 'in' ? fromAddr : toAddr),
      timestamp: txs[i].blockCreationTime,
      amount: formatWei(txs[i].value),
      user,
      type: txType
    }
    transactions.push(tx)
  }

  dispatch(fetchTxsSuccess(transactions))
}

const initialState = { pending: true, txs: [], error: null, sorted: [] }

const fetchTxsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TXS_PENDING:
      return { ...state, pending: true }
    case FETCH_TXS_SUCCESS:
      return { ...state, pending: false, txs: action.payload }
    case FETCH_TXS_ERROR:
      return { ...state, pending: false, error: action.payload }

    default:
      return state
  }
}

export default fetchTxsReducer
