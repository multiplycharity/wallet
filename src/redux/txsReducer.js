import { EXPLORER_API_HOST } from 'react-native-dotenv'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'

const address = '0x184EF1FF558b9134DcBb54dEF1a00f2A40C1a035'

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

export const fetchTxs = () => (dispatch, getState) => {
  dispatch(fetchTxsPending)

  fetch(`${EXPLORER_API_HOST}/account/${address}/txs`)
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        throw res.error
      }
      const txs = sortTxs(res.data)
      dispatch(fetchTxsSuccess(txs))
      return txs
    })
    .catch(error => {
      dispatch(fetchTxsError(res.error))
    })
}

const sortTxs = txs => {
  let transactions = []
  for (let i = 0; i < txs.length; i++) {
    let tx = {
      id: txs[i].txIndex,
      title: `0x${txs[i].from}`,
      timestamp: '2020-05-10 11:37',
      amount: ethers.utils.formatEther(txs[i].value) * 1000
    }
    transactions.push(tx)
  }

  return transactions
}

const initialState = { pending: false, txs: [], error: null, sorted: [] }

const txsReducer = (state = initialState, action) => {
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

export default txsReducer
