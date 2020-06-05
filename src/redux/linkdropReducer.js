import { ethers } from 'ethers'
const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL)

export const CLAIM_STARTED = 'CLAIM_STARTED'
export const CLAIM_SUCCESS = 'CLAIM_SUCCESS'
export const CLAIM_ERROR = 'CLAIM_ERROR'
export const LINK_GENERATION_STARTED = 'LINK_GENERATION_STARTED'
export const LINK_GENERATION_SUCCESS = 'LINK_GENERATION_SUCCESS'
export const LINK_GENERATION_ERROR = 'LINK_GENERATION_ERROR'

export const claimStarted = () => {
  return { type: CLAIM_STARTED }
}

export const claimSuccess = () => {
  return { type: CLAIM_SUCCESS }
}

export const claimError = error => {
  return { type: CLAIM_ERROR, payload: error }
}

export const linkGenerationStarted = () => {
  return { type: LINK_GENERATION_STARTED }
}

export const linkGenerationSuccess = () => {
  return { type: LINK_GENERATION_SUCCESS }
}

export const linkGenerationError = error => {
  return { type: LINK_GENERATION_ERROR, payload: error }
}

import {
  CHAIN_ID,
  JSON_RPC_URL,
  LINKDROP_FACTORY_ADDRESS,
  LINKDROP_SERVER_URL,
  LINKDROP_CAMPAIGN_ID
} from 'react-native-dotenv'
import LinkdropFactory from '../contracts/LinkdropFactory.json'
import moment from 'moment'

import LinkdropSDK from '@linkdrop/sdk'
import {
  parseWei,
  formatWei,
  getUrlParams,
  getUserByAddress,
  getUserByAddress2
} from '../helpers'
import { sendTx, formatTxs } from './transactions'
import { getWalletFromState } from './walletReducer'

import { Linking } from 'expo'
import { firestore } from 'firebase'
import { updateUser } from './userReducer'

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
    const proxyAddress = linkdropSDK.getProxyAddress(LINKDROP_CAMPAIGN_ID)

    // Persist to firestore and state
    !getState().user.linkdropContract &&
      dispatch(updateUser({ linkdropContract: proxyAddress }))

    // Deploy proxy contract if not deployed yet
    const code = await provider.getCode(proxyAddress)

    if (code === '0x') {
      const factoryContract = new ethers.Contract(
        LINKDROP_FACTORY_ADDRESS,
        LinkdropFactory.abi,
        sender
      )
      console.log('factoryContract: ', factoryContract)
      console.log('Deploying proxy', proxyAddress)
      const tx = await factoryContract.deployProxy(LINKDROP_CAMPAIGN_ID, {
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
    dispatch(linkGenerationStarted())
    const sender = dispatch(getWalletFromState())

    const linkdropSDK = dispatch(initLinkdropSDK(sender.address))

    const value = parseWei(amount)

    const proxyAddress = linkdropSDK.getProxyAddress(LINKDROP_CAMPAIGN_ID)

    await dispatch(deployProxyIfNeeded())

    let { url } = await linkdropSDK.generateLink({
      signingKeyOrWallet: sender.privateKey,
      nativeTokensAmount: value
    })

    const claimParams = await getUrlParams(url)

    url = Linking.makeUrl('/claim', {
      ...claimParams,
      timestamp: moment().unix()
    })

    //TODO shorten url
    dispatch(linkGenerationSuccess())
    return url
  } catch (err) {
    // console.error(err)
    dispatch(linkGenerationError(err))
    throw new Error(err)
  }
}

export const topupProxy = amount => async (dispatch, getState) => {
  try {
    const sender = dispatch(getWalletFromState())
    const linkdropSDK = dispatch(initLinkdropSDK(sender.address))

    const value = parseWei(amount)

    const proxyAddress = linkdropSDK.getProxyAddress(LINKDROP_CAMPAIGN_ID)

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
  try {
    dispatch(claimStarted())
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

    if (success) {
      dispatch(claimSuccess())

      dispatch(
        addLinkdropTxToFirebase({
          txHash,
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
          timestamp
        })
      )
    }

    return { success, txHash }
  } catch (error) {
    dispatch(claimError(error))
  }
}

export const addLinkdropTxToFirebase = ({
  txHash,
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
  sender: senderAddress,
  timestamp
}) => async (dispatch, getState) => {
  const myself = getState().user
  const sender = await getUserByAddress2(senderAddress)

  const tx = {
    txHash: txHash.toLowerCase(),
    from: senderAddress.toLowerCase(),
    to: myself.address.toLowerCase(),
    value: nativeTokensAmount.toString(),
    data: data,
    timestamp: timestamp,
    isLinkdrop: true,
    status: 'success'
  }

  const formatted = await dispatch(formatTxs([tx]))

  let linkdrops = myself.linkdrops || sender?.linkdrops || []

  linkdrops.push(...formatted, ...linkdrops)

  dispatch(updateUser({ linkdrops }))
}

// const linkdropReducer = (state = {}, action) => {
//   switch (action.type) {
//     default:
//       return state
//   }
// }
