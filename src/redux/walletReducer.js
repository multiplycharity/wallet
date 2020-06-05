import { ethers } from 'ethers'
import provider from '../services/providerService'

export const getWalletFromState = () => (dispatch, getState) => {
  const privateKey = getState().user?.wallet?.privateKey
  return new ethers.Wallet(privateKey, provider)
}
