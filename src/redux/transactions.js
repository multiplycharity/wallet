import { BLOCK_EXPLORER_URL, JSON_RPC_URL } from 'react-native-dotenv'
import { firestore } from '../config/firebase'

import { ethers } from 'ethers'
import {
  formatWei,
  formatAddress,
  getUserByAddress,
  getHexString
} from '../helpers'
import produce from 'immer'
import moment from 'moment'
import { AddressZero } from 'ethers/constants'
import provider from '../services/providerService'

export const FETCH_TXS_LOADING = 'FETCH_TXS_LOADING'
export const FETCH_TXS_SUCCESS = 'FETCH_TXS_SUCCESS'
export const FETCH_TXS_ERROR = 'FETCH_TXS_ERROR'
export const SET_HISTORY = 'SET_HISTORY'
export const SET_PENDING_TXS = 'SET_PENDING_TXS'
export const SET_LAST_INDEXED_TIMESTAMP = 'SET_LAST_INDEXED_TIMESTAMP'
export const ADD_TO_HISTORY = 'ADD_TO_HISTORY'
export const ADD_PENDING_TX = 'ADD_PENDING_TX'

export const SEND_TX_SUCCESS = 'SEND_TX_SUCCESS'
export const SEND_TX_ERROR = 'SEND_TX_ERROR'
export const SEND_TX_PENDING = 'SEND_TX_PENDING'
export const SEND_TX_STARTED = 'SEND_TX_STARTED'

const initialState = {
  isLoading: false,
  pendingTxs: [],
  history: [],
  error: null,
  lastIndexedTimestamp: null
}

export const sendTx = ({ to, value, data = '0x' }) => async (
  dispatch,
  getState
) => {
  try {
    dispatch(sendTxStarted())

    const amount = value

    const privateKey = getState().user?.wallet?.privateKey
    const sender = new ethers.Wallet(privateKey, provider)

    const txValue = ethers.utils.parseUnits(
      (parseFloat(value) / 100).toString()
    )

    let tx = await sender.sendTransaction({
      to,
      value: txValue,
      data,
      gasPrice: ethers.utils.parseUnits('1', 'gwei') // FIXME
    })

    const user = await getUserByAddress(tx.to)

    let txn = {
      id: tx.hash.toLowerCase(),
      txHash: tx.hash.toLowerCase(),
      from: tx.from.toLowerCase(),
      to: tx.to.toLowerCase(),
      value: txValue.toString(),
      data: data,
      title: user?.name || tx.to.toLowerCase(),
      timestamp: moment().unix(),
      amount: amount,
      user: user,
      type: 'out',
      status: 'pending'
    }

    dispatch(addPendingTx(txn))
    dispatch(waitForTx(txn))
  } catch (error) {
    dispatch(sendTxError(error))
    throw new Error(error)
  }
}

export const waitForTx = tx => async (dispatch, getState) => {
  await provider.waitForTransaction(tx.txHash)
  dispatch(moveToHistory(tx))
}

export const sendTxStarted = () => {
  return { type: SEND_TX_STARTED }
}

export const sendTxError = error => {
  return { type: SEND_TX_ERROR, payload: error }
}

export const sendTxSuccess = () => {
  return { type: SEND_TX_SUCCESS }
}

export const setHistory = history => {
  return { type: SET_HISTORY, payload: history }
}

export const addPendingTx = tx => async (dispatch, getState) => {
  dispatch({ type: ADD_PENDING_TX })

  let pendingTxs = getState().transactions.pendingTxs
  pendingTxs = [tx, ...pendingTxs]
  dispatch(setPengingTxs(pendingTxs))

  const history = getState().transactions.history

  const formatted = await dispatch(formatTxs([...pendingTxs, ...history]))

  dispatch(setHistory(formatted))
}

export const moveToHistory = tx => async (dispatch, getState) => {
  let pendingTxs = getState().transactions.pendingTxs.filter(
    txn => txn.txHash != tx.txHash
  )
  dispatch(setPengingTxs(pendingTxs))

  const history = getState().transactions.history

  const index = history.findIndex(txn => txn.txHash === tx.txHash)

  const txn = await provider.getTransactionReceipt(tx.txHash)
  const block = await provider.getBlock(txn.hash)
  const timestamp = block.timestamp

  const updatedHistory =
    index !== -1
      ? produce(history, draft => {
          draft[index].status = 'success'
          draft[index].timestamp = timestamp
        })
      : history

  const formatted = await dispatch(
    formatTxs([...pendingTxs, ...updatedHistory])
  )
  dispatch(setHistory(formatted))
  dispatch(sendTxSuccess())
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
  return { type: FETCH_TXS_SUCCESS }
}

export const fetchTxsError = error => {
  return { type: FETCH_TXS_ERROR, payload: error }
}

export const fetchTxs = () => async (dispatch, getState) => {
  const address = getState().user?.wallet?.address || getState().user?.address
  const history = getState().transactions.history

  dispatch(fetchTxsLoading())

  try {
    let res = await fetch(
      `${BLOCK_EXPLORER_URL}/api?module=account&action=txlist&address=${address}`
    )

    res = await res.json()

    if (res.status != 1) {
      throw res.message
    }

    const pendingTxs = getState().transactions.pendingTxs

    const formatted = await dispatch(
      formatTxs([...pendingTxs, ...history, ...res.result])
    )

    dispatch(setHistory(formatted))
    dispatch(fetchTxsSuccess())
  } catch (error) {
    dispatch(fetchTxsError(error.message || error))
  }
}

const formatTxs = txs => async (dispatch, getState) => {
  const userAddress =
    getState().user?.wallet?.address || getState().user?.address

  let formatted = []

  for (let i = 0; i < txs.length; i++) {
    const fromAddr = txs[i].from
    const toAddr = txs[i].to || AddressZero
    const txType =
      formatAddress(toAddr) == formatAddress(userAddress) ? 'in' : 'out'
    const txHash = txs[i].txHash || txs[i].hash

    const user = await getUserByAddress(txType === 'in' ? fromAddr : toAddr)

    let timestamp = txs[i].timestamp || txs[i].timeStamp

    const lastIndexedTimestamp = getState().transactions.lastIndexedTimestamp

    if (timestamp > lastIndexedTimestamp)
      dispatch(setLastIndexedTimestamp(timestamp))

    let tx = {
      id: txHash,
      txHash: txHash,
      from: fromAddr,
      to: toAddr,
      value: txs[i].value,
      data: txs[i].data,
      title: user?.name || (txType === 'in' ? fromAddr : toAddr),
      timestamp: timestamp,
      amount: formatWei(txs[i].value),
      user,
      type: txType,
      status: txs[i].status
    }
    formatted.push(tx)
  }
  const set = new Set()

  let result = formatted
    .filter(item => {
      if (!set.has(item.txHash)) {
        set.add(item.txHash)
        return true
      }
      return false
    }, set)
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))

  return result
}

const transactionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TXS_LOADING:
      return { ...state, isLoading: true }
    case FETCH_TXS_SUCCESS:
      return { ...state, isLoading: false }
    case FETCH_TXS_ERROR:
      return { ...state, isLoading: false, error: action.payload }
    case SET_LAST_INDEXED_TIMESTAMP:
      return { ...state, lastIndexedTimestamp: action.payload }
    case SET_HISTORY:
      return { ...state, history: action.payload }
    case SET_PENDING_TXS: {
      return { ...state, pendingTxs: action.payload }
    }

    case SEND_TX_ERROR:
      return {
        ...state,
        error: action.payload.error
        // pendingTxs: state.pendingTxs.filter(
        //   txHash => txHash !== action.payload.tx.hash
        // )
      }

    default:
      return state
  }
}

export default transactionsReducer
