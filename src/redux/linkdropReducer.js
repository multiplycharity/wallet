import provider from '../services/providerService'
import { ethers } from 'ethers'
import {
  CHAIN_ID,
  JSON_RPC_URL,
  LINKDROP_FACTORY_ADDRESS
} from 'react-native-dotenv'
import LinkdropFactory from '../contracts/LinkdropFactory.json'
import LinkdropSDK from '@linkdrop/sdk'
import { parseWei } from '../helpers'
const CAMPAIGN_ID = 0

export const generateLink = amount => async (dispatch, getState) => {
  try {
    const value = parseWei(amount)

    const privateKey = getState().user.wallet.privateKey
    const sender = new ethers.Wallet(privateKey, provider)
    const linkdropSDK = new LinkdropSDK({
      senderAddress: sender.address,
      chainId: CHAIN_ID,
      jsonRpcUrl: JSON_RPC_URL,
      factoryAddress: LINKDROP_FACTORY_ADDRESS
    })
    const proxyAddress = linkdropSDK.getProxyAddress(CAMPAIGN_ID)

    // Deploy proxy contract if not deployed yet
    const code = await provider.getCode(proxyAddress)
    if (code === '0x') {
      const factoryContract = new ethers.Contract(
        LINKDROP_FACTORY_ADDRESS,
        LinkdropFactory.abi,
        sender
      )
      console.log('Deploying proxy', proxyAddress)
      const tx = await factoryContract.deployProxy(CAMPAIGN_ID, {
        gasPrice: ethers.utils.parseUnits('1', 'gwei') //FIXME
      })
      console.log('Tx hash: ', tx.hash)
    }
    // Send fund to be claimed to the proxy contract
    const tx = await sender.sendTransaction({
      to: proxyAddress,
      value: value,
      gasLimit: 23000,
      gasPrice: ethers.utils.parseUnits('1', 'gwei')
    })

    console.log(`Sending ${amount} to proxy contract`)
    console.log(`Tx hash: ${tx.hash}`)

    const { url } = await linkdropSDK.generateLink({
      signingKeyOrWallet: sender.privateKey,
      nativeTokensAmount: value
    })
    return url
  } catch (err) {
    // console.error(err)
    throw new Error(err)
  }
}
