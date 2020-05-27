import { ethers } from 'ethers'

export const isEthereumAddress = address => {
  const regex = RegExp('^0x[a-fA-F0-9]{40}$')
  return regex.test(address)
}

export const formatWei = value => {
  return (ethers.utils.formatEther(value) * 100).toFixed(2).replace(/\.00$/, '')
}
