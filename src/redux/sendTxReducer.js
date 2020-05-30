import { JSON_RPC_URL } from 'react-native-dotenv'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import { formatWei, formatAddress } from '../helpers'

export const SEND_TX_SUCCESS = 'SEND_TX_SUCCESS'
export const SEND_TX_ERROR = 'SEND_TX_ERROR'
export const SEND_TX_PENDING = 'SEND_TX_PENDING'

export const sendTxPending = () => {
  return { type: SEND_TX_PENDING }
}

export const sendTxError = error => {
  return { type: SEND_TX_ERROR, payload: error }
}

export const sendTxSuccess = txHash => {
  return { type: SEND_TX_SUCCESS, payload: txHash }
}

export const sendTx = ({ to, value, data = '0x' }) => async (
  dispatch,
  getState
) => {
  dispatch(sendTxPending())
  try {
    const privateKey = getState().user?.wallet?.privateKey
    const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL)
    const sender = new ethers.Wallet(privateKey, provider)

    value = ethers.utils.parseUnits((parseFloat(value) / 100).toString())

    const tx = await sender.sendTransaction({ to, value, data })
    await tx.wait(1)

    dispatch(sendTxSuccess(tx.hash))
  } catch (error) {
    console.log('error: ', error)
    dispatch(sendTxError(error))
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

const initialState = {
  pending: true,
  txHash: null,
  txHashes: [],
  error: null,
  sorted: []
}

const sendTxReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_TX_PENDING:
      return { ...state, pending: true }
    case SEND_TX_SUCCESS:
      return {
        ...state,
        pending: false,
        txHash: action.payload,
        txHashes: [...state.txHashes, action.payload]
      }
    case SEND_TX_ERROR:
      return { ...state, pending: false, error: action.payload }

    default:
      return state
  }
}

export default sendTxReducer
