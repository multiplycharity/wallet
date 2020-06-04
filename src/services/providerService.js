import { ethers } from 'ethers'
import { JSON_RPC_URL } from 'react-native-dotenv'
console.log('JSON_RPC_URL: ', JSON_RPC_URL)
import { formatWei } from '../helpers'

const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL)

export const getBalance = async address => {
  const balance = await provider.getBalance(address)
  return formatWei(balance)
}

export default provider
