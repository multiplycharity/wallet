const url =
  'https://claim-v2.linkdrop.io/#/receive?token=0x0000000000000000000000000000000000000000&nft=0x0000000000000000000000000000000000000000&feeToken=0x0000000000000000000000000000000000000000&feeReceiver=0x0000000000000000000000000000000000000000&linkKey=0x907c7a7629b32bc7c5d69679ee48781e615b35e886699dff081f9f9bf94f640f&nativeTokensAmount=10000000000000000&tokensAmount=0&tokenId=0&feeAmount=0&expiration=11111111111&data=0x&signerSignature=0x4905c48ba19035b984df96a4a9930bb3b409e8e0d4f6dcb3f8547d4e41aae8b2059e4c0fcc2832c1aad9a25f9fb2518f1476e8d533d6966200e335d2e57e88301b&linkdropContract=0x1b181ab2432147829dc9e3b8bdeafb336602f63c&sender=0x98075199fD8b495A2b17A1b926FAE8c59f5D8a22&chainId=77'

import { getUrlParams } from './src/helpers'

const main = async () => {
  const parsed = await getUrlParams(url)
  console.log('parsed: ', parsed)
}

main()
