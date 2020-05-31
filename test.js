const ethers = require('ethers')

const provider = ethers.getDefaultProvider('rinkeby')

const txHash =
  '0x57dfc7d1886cbb4d635130df791aa7cde365faa677d837c66dc6513157a33a60'

const main = async () => {
  const tx = await provider.getTransactionReceipt(txHash)
  const timestamp = (await provider.getBlock(tx.hash)).timestamp
  console.log('timestamp: ', timestamp)
}

main()
