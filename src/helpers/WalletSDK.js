import { ethers } from 'ethers'
import { JSON_RPC_URL } from 'react-native-dotenv'
import { formatWei } from '../helpers'

class WalletSDK {
  constructor (jsonRpcUrl = JSON_RPC_URL) {
    this.jsonRpcUrl = jsonRpcUrl
    this.provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  }

  async getBalance (address) {
    let balance = await this.provider.getBalance(address)
    return formatWei(balance)
  }
}

export default WalletSDK
