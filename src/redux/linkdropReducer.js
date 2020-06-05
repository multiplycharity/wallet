import provider from '../services/providerService'
import { ethers } from 'ethers'
import {
  CHAIN_ID,
  JSON_RPC_URL,
  LINKDROP_FACTORY_ADDRESS,
  LINKDROP_SERVER_URL
} from 'react-native-dotenv'
import LinkdropFactory from '../contracts/LinkdropFactory.json'
import moment from 'moment'

import LinkdropSDK from '@linkdrop/sdk'
import { parseWei, getUrlParams } from '../helpers'
import { sendTx } from './transactions'
import { getWalletFromState } from './walletReducer'

import { Linking } from 'expo'

const CAMPAIGN_ID = 0

export const initLinkdropSDK = senderAddress => (dispatch, getState) => {
  return new LinkdropSDK({
    senderAddress: senderAddress,
    chainId: CHAIN_ID,
    jsonRpcUrl: JSON_RPC_URL,
    factoryAddress: LINKDROP_FACTORY_ADDRESS,
    apiHost: LINKDROP_SERVER_URL,
    claimHost: Linking.makeUrl('/')
  })
}

export const deployProxyIfNeeded = () => async (dispatch, getState) => {
  try {
    const sender = dispatch(getWalletFromState())
    const linkdropSDK = dispatch(initLinkdropSDK(sender.address))
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
      return tx.hash
    }
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

    await dispatch(deployProxyIfNeeded())

    let { url } = await linkdropSDK.generateLink({
      signingKeyOrWallet: sender.privateKey,
      nativeTokensAmount: value
    })

    const claimParams = await getUrlParams(url)
    console.log('claimParams: ', claimParams)

    url = Linking.makeUrl('/claim', {
      ...claimParams,
      timestamp: moment().unix()
    })

    //TODO shorten url

    return url
  } catch (err) {
    // console.error(err)
    throw new Error(err)
  }
}

export const topupProxy = amount => async (dispatch, getState) => {
  try {
    const sender = dispatch(getWalletFromState())
    const linkdropSDK = dispatch(initLinkdropSDK(sender.address))

    const value = parseWei(amount)

    const proxyAddress = linkdropSDK.getProxyAddress(CAMPAIGN_ID)

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
    return tx.hash
  } catch (error) {
    throw new Error(error)
  }
}

export const claimLink = ({
  token,
  nft,
  feeToken,
  feeReceiver,
  nativeTokensAmount,
  tokensAmount,
  tokenId,
  feeAmount,
  expiration,
  data,
  linkKey,
  signerSignature,
  linkdropContract,
  sender
}) => async (dispatch, getState) => {
  const receiver = dispatch(getWalletFromState())
  const linkdropSDK = dispatch(initLinkdropSDK(receiver.address))

  const { success, txHash } = await linkdropSDK.claim({
    token,
    nft,
    feeToken,
    feeReceiver,
    nativeTokensAmount,
    tokensAmount,
    tokenId,
    feeAmount,
    expiration,
    data,
    linkKey,
    signerSignature,
    linkdropContract,
    sender,
    receiverAddress: receiver.address
  })
  return { success, txHash }
}
