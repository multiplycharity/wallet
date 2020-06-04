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
import { sendTx } from './transactions'
import { getWalletFromState } from './walletReducer'

const CAMPAIGN_ID = 0

export const initLinkdropSDK = senderAddress => (dispatch, getState) => {
  return new LinkdropSDK({
    senderAddress: senderAddress,
    chainId: CHAIN_ID,
    jsonRpcUrl: JSON_RPC_URL,
    factoryAddress: LINKDROP_FACTORY_ADDRESS
  })
}

export const deployProxyIfNeeded = () => async (dispatch, getState) => {
  try {
    const sender = dispatch(getWalletFromState())
    const linkdropSDK = dispatch(initLinkdropSDK(sender.address))
  } catch (err) {
    throw new Error(err)
  }
}

export const generateLink = amount => async (dispatch, getState) => {
  try {
    const sender = dispatch(getWalletFromState())
    const linkdropSDK = dispatch(initLinkdropSDK(sender.address))

    const value = parseWei(amount)

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
    const tx = await dispatch(
      sendTx({
        to: proxyAddress,
        amount: amount,
        gasLimit: 24000,
        gasPrice: ethers.utils.parseUnits('1', 'gwei')
      })
    )

    console.log(`Sending ${amount} to proxy contract`)
    console.log(`Tx hash: ${tx.txHash}`)

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
